import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/connection';
import Order from '@/lib/mongodb/models/Order';
import { auth } from '@clerk/nextjs/server';
import { trackByAWB, trackByOrderId, isShiprocketConfigured } from '@/lib/shiprocket/client';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!isShiprocketConfigured()) {
            return NextResponse.json(
                { error: 'Shiprocket is not configured.' },
                { status: 503 }
            );
        }

        await dbConnect();

        const order = await Order.findOne({ _id: params.id, userId });
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        let trackingData;

        if (order.awbCode) {
            trackingData = await trackByAWB(order.awbCode);
        } else if (order.shiprocketOrderId) {
            trackingData = await trackByOrderId(order.shiprocketOrderId);
        } else {
            return NextResponse.json({
                tracking: null,
                message: 'Shipment not yet dispatched. Tracking will be available once the order is shipped.',
            });
        }

        return NextResponse.json({ tracking: trackingData });
    } catch (error) {
        console.error('Tracking Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tracking info' },
            { status: 500 }
        );
    }
}
