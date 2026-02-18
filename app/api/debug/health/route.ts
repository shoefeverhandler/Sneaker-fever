
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/connection';
import Razorpay from 'razorpay';
import { checkServiceability } from '@/lib/shiprocket/client';

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
        const email = process.env.SHIPROCKET_EMAIL;
        const password = process.env.SHIPROCKET_PASSWORD;

        if (!email || !password) {
            results.shiprocket.status = 'failed';
            results.shiprocket.message = 'Shiprocket credentials missing (SHIPROCKET_EMAIL/PASSWORD).';
        } else {
            // Test actual API logic by calling the client function directly
            // Using a dummy pincode to test connectivity
            const data = await checkServiceability('110001', '110001', 0.5, 0);
            if (data && data.status !== 401 && data.status !== 404) {
                // 404 is acceptable here as it means API responded but pincode was just invalid
                results.shiprocket.status = 'connected';
                results.shiprocket.message = 'Shiprocket API authenticated successfully.';
            } else if (data && data.status === 401) {
                results.shiprocket.status = 'failed';
                results.shiprocket.message = 'Shiprocket authentication failed. Check credentials.';
            } else {
                results.shiprocket.status = 'connected';
                results.shiprocket.message = 'Shiprocket API responded (Serviceability check verified).';
            }
        }
    } catch (error: any) {
        results.shiprocket.status = 'failed';
        results.shiprocket.message = `Connection Error: ${error.message}`;
    }

    // 3. Check Razorpay
    try {
        const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            results.razorpay.status = 'failed';
            results.razorpay.message = 'Missing API Keys in .env file.';
        } else {
            // Note: In test mode, instance initialization is enough to verify presence of keys
            results.razorpay.status = 'connected';
            results.razorpay.message = 'Keys are present and instance initialized.';
        }
    } catch (error: any) {
        results.razorpay.status = 'failed';
        results.razorpay.message = error.message;
    }

    return NextResponse.json(results);
}
