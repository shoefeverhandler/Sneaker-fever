import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/connection';
import Order from '@/lib/mongodb/models/Order';

/**
 * Shiprocket Webhook Handler
 *
 * Shiprocket sends POST requests to this endpoint whenever a shipment
 * status changes. Configure this URL in your Shiprocket dashboard:
 *   Settings → Webhooks → Add New → https://yourdomain.com/api/webhooks/shiprocket
 *
 * Payload fields used:
 *   - order_id:        Our MongoDB order _id (passed as Shiprocket's channel_order_id)
 *   - awb:             Air Waybill code
 *   - current_status:  e.g. "Shipped", "In Transit", "Delivered", "RTO Initiated"
 *   - courier_name:    Name of the assigned courier
 *   - etd:             Estimated Time of Delivery
 */

// Map Shiprocket status strings to our internal orderStatus enum
function mapShiprocketStatus(srStatus: string): string {
    const normalized = srStatus.toLowerCase().trim();

    if (['new', 'pickup scheduled', 'pickup generated'].includes(normalized)) return 'processing';
    if (['shipped', 'picked up'].includes(normalized)) return 'shipped';
    if (['in transit', 'reached at destination hub'].includes(normalized)) return 'in_transit';
    if (['out for delivery'].includes(normalized)) return 'out_for_delivery';
    if (['delivered'].includes(normalized)) return 'delivered';
    if (['canceled', 'cancelled'].includes(normalized)) return 'cancelled';
    if (normalized.includes('rto')) return 'rto';

    return 'processing'; // Fallback
}

export async function POST(req: Request) {
    try {
        const payload = await req.json();

        const {
            order_id,        // Shiprocket's numeric order ID
            awb,
            current_status,
            courier_name,
            etd,
        } = payload;

        // Verify Webhook Token
        const webhookToken = req.headers.get('x-api-key');
        const expectedToken = process.env.SHIPROCKET_WEBHOOK_SECRET;

        // Only enforce token check if we have one defined in our env
        if (expectedToken && webhookToken !== expectedToken) {
            console.error('Invalid Shiprocket Webhook Token received');
            return NextResponse.json({ error: 'Unauthorized webhook' }, { status: 401 });
        }

        if (!order_id && !awb) {
            return NextResponse.json({ error: 'Missing identifiers' }, { status: 400 });
        }

        await dbConnect();

        // Find order by Shiprocket order ID or AWB
        const filter = order_id
            ? { shiprocketOrderId: Number(order_id) }
            : { awbCode: awb };

        const update: Record<string, any> = {
            orderStatus: mapShiprocketStatus(current_status || ''),
        };

        if (awb) update.awbCode = awb;
        if (courier_name) update.courierName = courier_name;

        const updatedOrder = await Order.findOneAndUpdate(filter, update, { new: true });

        if (!updatedOrder) {
            console.warn(`Shiprocket webhook: no matching order for`, filter);
            // Still return 200 so Shiprocket doesn't retry endlessly
            return NextResponse.json({ received: true, matched: false });
        }

        return NextResponse.json({ received: true, matched: true, status: update.orderStatus });
    } catch (error) {
        console.error('Shiprocket Webhook Error:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}
