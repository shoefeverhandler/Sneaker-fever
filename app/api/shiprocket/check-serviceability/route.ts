import { NextResponse } from 'next/server';
import { checkServiceability } from '@/lib/shiprocket/client';

export async function POST(req: Request) {
    try {
        const { deliveryPincode, weight, cod } = await req.json();

        if (!deliveryPincode) {
            return NextResponse.json({ error: 'Delivery pincode is required' }, { status: 400 });
        }

        // Use configured pickup pincode or fallback
        const pickupPincode = process.env.SHIPROCKET_PICKUP_PINCODE || '110001';

        const data = await checkServiceability(
            pickupPincode,
            deliveryPincode,
            weight || 0.5, // Default weight 0.5kg
            cod || 0       // Default prepaid
        );

        if (data.status === 404 || !data.data || !data.data.available_courier_companies || data.data.available_courier_companies.length === 0) {
            return NextResponse.json({ error: 'No courier service available for this pincode' }, { status: 404 });
        }

        // Return the recommended courier or cheapest one
        // Shiprocket returns a list. We can pick the one with lowest rate.
        const couriers = data.data.available_courier_companies;

        // Find cheapest rate
        const cheapest = couriers.reduce((prev: any, curr: any) => {
            return prev.rate < curr.rate ? prev : curr;
        });

        return NextResponse.json({
            success: true,
            courier_name: cheapest.courier_name,
            rate: cheapest.rate,
            etd: cheapest.etd,
        });

    } catch (error: any) {
        console.error('Shiprocket Serviceability Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to check serviceability' },
            { status: 500 }
        );
    }
}
