import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb/connection';
import Order from '@/lib/mongodb/models/Order';
import { auth } from '@clerk/nextjs/server';
import {
    createShiprocketOrder,
    isShiprocketConfigured,
} from '@/lib/shiprocket/client';

export async function POST(req: Request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderDetails
        } = await req.json();

        const { userId } = await auth();

        // Verify Signature
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!keySecret) {
            return NextResponse.json(
                { error: 'Razorpay is not configured. Please add RAZORPAY_KEY_SECRET to your .env.local file.' },
                { status: 503 }
            );
        }

        const generated_signature = crypto
            .createHmac('sha256', keySecret)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            return NextResponse.json(
                { error: 'Payment verification failed' },
                { status: 400 }
            );
        }

        // Connect to DB and Save Order
        await dbConnect();

        const newOrder = await Order.create({
            userId: userId || 'guest_user',
            items: orderDetails.items,
            shippingAddress: orderDetails.shippingAddress,
            totalAmount: orderDetails.totalAmount,
            shippingCost: orderDetails.shippingCost || 0,
            paymentId: razorpay_payment_id,
            paymentStatus: 'completed',
            orderStatus: 'processing',
        });

        // ── Push to Shiprocket (non-blocking — order is already saved) ──
        if (isShiprocketConfigured()) {
            try {
                const now = new Date();
                const orderDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

                const shiprocketRes = await createShiprocketOrder({
                    order_id: newOrder._id.toString(),
                    order_date: orderDate,
                    pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary',
                    billing_customer_name: orderDetails.shippingAddress.name.split(' ')[0],
                    billing_last_name: orderDetails.shippingAddress.name.split(' ').slice(1).join(' ') || '',
                    billing_address: orderDetails.shippingAddress.address,
                    billing_city: orderDetails.shippingAddress.city,
                    billing_pincode: orderDetails.shippingAddress.pincode,
                    billing_state: orderDetails.shippingAddress.state,
                    billing_country: 'India',
                    billing_email: orderDetails.email || '',
                    billing_phone: orderDetails.shippingAddress.phone,
                    shipping_is_billing: true,
                    order_items: orderDetails.items.map((item: any) => ({
                        name: item.title,
                        sku: item.productId,
                        units: item.quantity,
                        selling_price: item.price,
                    })),
                    payment_method: 'Prepaid',
                    sub_total: orderDetails.totalAmount,
                    length: 30,  // Default box dimensions (cm)
                    breadth: 20,
                    height: 15,
                    weight: 0.8, // Default weight (kg)
                });

                // Save Shiprocket IDs back to the order
                await Order.findByIdAndUpdate(newOrder._id, {
                    shiprocketOrderId: shiprocketRes.order_id,
                    shiprocketShipmentId: shiprocketRes.shipment_id,
                    awbCode: shiprocketRes.awb_code || undefined,
                    courierName: shiprocketRes.courier_name || undefined,
                });
            } catch (shipErr) {
                // Log but don't fail — the order is already saved
                console.error('Shiprocket order push failed:', shipErr);
            }
        }

        return NextResponse.json({ success: true, orderId: newOrder._id });

    } catch (error) {
        console.error('Payment Verification Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
