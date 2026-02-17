import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/connection';
import Order from '@/lib/mongodb/models/Order';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const orders = await Order.find({ userId }).sort({ createdAt: -1 });

        return NextResponse.json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
