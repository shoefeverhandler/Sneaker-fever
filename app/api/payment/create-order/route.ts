import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

/**
 * Lazily create a Razorpay instance only when keys are available.
 * This prevents build-time / import-time crashes when keys aren't set.
 */
function getRazorpayInstance() {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
        return null;
    }

    return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export async function POST(req: Request) {
    try {
        const razorpay = getRazorpayInstance();

        if (!razorpay) {
            return NextResponse.json(
                {
                    error: 'Razorpay is not configured. Please add NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env.local file.',
                },
                { status: 503 }
            );
        }

        const { amount, notes } = await req.json();

        if (!amount) {
            return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
        }

        const order = await razorpay.orders.create({
            amount: Math.round(amount * 100), // convert to paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: notes || {}
        });

        return NextResponse.json({ orderId: order.id });
    } catch (error) {
        console.error('Razorpay Error:', error);
        return NextResponse.json(
            { error: 'Error creating order' },
            { status: 500 }
        );
    }
}
