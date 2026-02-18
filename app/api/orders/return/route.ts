
import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb/connection';
import Order from '@/lib/mongodb/models/Order';
import { createReturnOrder } from '@/lib/shiprocket/client';

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { orderId, reason } = await req.json();

        if (!orderId || !reason) {
            return NextResponse.json(
                { error: 'Order ID and reason are required' },
                { status: 400 }
            );
        }

        await dbConnect();

        const order = await Order.findOne({ _id: orderId, userId });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Validate Return Window (7 Days)
        if (order.orderStatus !== 'delivered') {
            return NextResponse.json(
                { error: 'Order must be delivered before it can be returned.' },
                { status: 400 }
            );
        }

        // Check if return already requested
        if (order.returnStatus && order.returnStatus !== 'none') {
            return NextResponse.json(
                { error: 'Return already requested for this order.' },
                { status: 400 }
            );
        }

        // We need to fetch tracking details to know delivery date, 
        // OR rely on updatedAt if status is delivered.
        // For strictness, let's assume updatedAt is the delivery time if status is delivered.
        // Ideally we should store `deliveredAt` in the Order model, but updatedAt is a close proxy if updated on delivery webhook.
        const deliveryDate = new Date(order.updatedAt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - deliveryDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 7) {
            return NextResponse.json(
                { error: 'Return window (7 days) has expired.' },
                { status: 400 }
            );
        }

        // Create Return Order in Shiprocket
        // Note: Shiprocket return API takes 'order_id' as the original order ID string
        const returnPayload = {
            order_id: order._id.toString(), // Internal Order ID as ref
            order_date: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0].slice(0, 5), // YYYY-MM-DD HH:mm
            pickup_customer_name: order.shippingAddress.name,
            pickup_address: order.shippingAddress.address,
            pickup_city: order.shippingAddress.city,
            pickup_pincode: order.shippingAddress.pincode,
            pickup_state: order.shippingAddress.state,
            pickup_phone: order.shippingAddress.phone,
            pickup_email: user?.emailAddresses?.[0]?.emailAddress || '', // Fallback to auth email
            order_items: order.items.map((item: any) => ({
                name: item.title,
                sku: item.productId,
                units: item.quantity,
                selling_price: item.price,
            })),
            payment_method: 'Prepaid' as const,
            sub_total: order.totalAmount,
            length: 30, // Default dimensions
            breadth: 20,
            height: 15,
            weight: 0.5, // Default weight
        };

        try {
            const shiprocketRes = await createReturnOrder(returnPayload);

            // Update Local Order
            order.returnStatus = 'requested'; // Or 'approved' since it's auto-created in Shiprocket
            order.returnReason = reason;
            order.returnShiprocketOrderId = shiprocketRes.order_id;
            await order.save();

            return NextResponse.json({ success: true, returnOrderId: shiprocketRes.order_id });
        } catch (shipError: any) {
            console.error('Shiprocket Return Error:', shipError);
            return NextResponse.json(
                { error: 'Failed to initiate return with courier partner. Please contact support.', details: shipError.message },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Return Request Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
