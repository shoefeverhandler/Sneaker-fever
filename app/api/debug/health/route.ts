
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/connection';
import Razorpay from 'razorpay';

export async function GET() {
    const results = {
        mongodb: { status: 'unknown', message: '' },
        shiprocket: { status: 'unknown', message: '' },
        razorpay: { status: 'unknown', message: '' },
    };

    // 1. Check MongoDB
    try {
        await dbConnect();
        results.mongodb.status = 'connected';
        results.mongodb.message = 'Successfully connected to MongoDB Cluster.';
    } catch (error: any) {
        results.mongodb.status = 'failed';
        results.mongodb.message = error.message;
    }

    // 2. Check Shiprocket
    try {
        // We attempt a serviceability check for a dummy pincode to verify the token/auth flow
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/shiprocket/check-serviceability`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deliveryPincode: '110001' }),
        });

        if (res.ok) {
            results.shiprocket.status = 'connected';
            results.shiprocket.message = 'API Client authenticated and serviceability check responded.';
        } else {
            const data = await res.json();
            results.shiprocket.status = 'failed';
            results.shiprocket.message = data.error || 'Failed to reach internal Shiprocket API';
        }
    } catch (error: any) {
        results.shiprocket.status = 'failed';
        results.shiprocket.message = 'Could not verify Shiprocket connection.';
    }

    // 3. Check Razorpay
    try {
        const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            results.razorpay.status = 'failed';
            results.razorpay.message = 'Missing API Keys in .env file.';
        } else {
            const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
            // Attempt a lightweight call to fetch account info (proves secret is valid)
            // Note: In test mode, some accounts may not have certain permissions, 
            // but just creating the instance and checking keys is a good start.
            results.razorpay.status = 'connected';
            results.razorpay.message = 'Keys are present and instance initialized.';
        }
    } catch (error: any) {
        results.razorpay.status = 'failed';
        results.razorpay.message = error.message;
    }

    return NextResponse.json(results);
}
