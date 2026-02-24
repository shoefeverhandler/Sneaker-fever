import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/connection';
import Order from '@/lib/mongodb/models/Order';
import { auth } from '@clerk/nextjs/server';
import { cancelShiprocketOrder, isShiprocketConfigured } from '@/lib/shiprocket/client';

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { orderId } = await req.json();

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        await dbConnect();

        // Find the order
        const order = await Order.findOne({ _id: orderId, userId });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Check if the order can be cancelled
        if (!['new', 'processing'].includes(order.orderStatus)) {
            return NextResponse.json({
                error: 'Order cannot be cancelled because it has already been shipped or processed.'
            }, { status: 400 });
        }

        // Cancel in Shiprocket if it was pushed there
        if (order.shiprocketOrderId && isShiprocketConfigured()) {
            try {
                await cancelShiprocketOrder([order.shiprocketOrderId]);
            } catch (shipErr) {
                console.error(`Failed to cancel Shiprocket order ${order.shiprocketOrderId}:`, shipErr);
                // We'll still allow the DB cancellation even if Shiprocket fails, 
                // as Shiprocket might not have fully ingested it yet, or we can manually sync.
            }
        }

        // Update DB
        order.orderStatus = 'cancelled';
        await order.save();

        return NextResponse.json({ success: true, message: 'Order cancelled successfully' });

    } catch (error) {
        console.error('Cancel Order Error:', error);
        return NextResponse.json(
            { error: 'Failed to cancel the order. Please contact support.' },
            { status: 500 }
        );
    }
}
