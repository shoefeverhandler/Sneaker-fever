/**
 * Shiprocket API Client
 *
 * Handles JWT authentication (with auto-refresh) and exposes typed
 * methods for order creation, tracking, and cancellation.
 *
 * Shiprocket tokens are valid for 10 days. We cache the token in
 * module-level state (fine for serverless — each cold-start gets a
 * fresh token, and within a warm instance we reuse it).
 */

const BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

interface ShiprocketToken {
    token: string;
    expiresAt: number; // Unix ms
}

let cachedToken: ShiprocketToken | null = null;

// ─── Authentication ───────────────────────────────────────────────

async function getToken(): Promise<string> {
    // Return cached token if it hasn't expired (with 1-hour buffer)
    if (cachedToken && Date.now() < cachedToken.expiresAt - 3600_000) {
        return cachedToken.token;
    }

    const email = process.env.SHIPROCKET_EMAIL;
    const password = process.env.SHIPROCKET_PASSWORD;

    if (!email || !password) {
        throw new Error(
            'Shiprocket credentials missing. Set SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD in .env.local'
        );
    }

    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Shiprocket auth failed (${res.status}): ${body}`);
    }

    const data = await res.json();

    cachedToken = {
        token: data.token,
        expiresAt: Date.now() + 10 * 24 * 60 * 60 * 1000, // 10 days
    };

    return cachedToken.token;
}

async function shiprocketFetch(
    path: string,
    options: RequestInit = {}
): Promise<any> {
    const token = await getToken();

    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Shiprocket API error (${res.status}): ${body}`);
    }

    return res.json();
}

// ─── Types ────────────────────────────────────────────────────────

export interface ShiprocketOrderItem {
    name: string;
    sku: string;
    units: number;
    selling_price: number;
}

export interface CreateOrderPayload {
    order_id: string;
    order_date: string; // YYYY-MM-DD HH:mm
    pickup_location: string;
    billing_customer_name: string;
    billing_last_name?: string;
    billing_address: string;
    billing_city: string;
    billing_pincode: string;
    billing_state: string;
    billing_country: string;
    billing_email: string;
    billing_phone: string;
    shipping_is_billing: boolean;
    order_items: ShiprocketOrderItem[];
    payment_method: 'Prepaid' | 'COD';
    sub_total: number;
    length: number; // cm
    breadth: number; // cm
    height: number; // cm
    weight: number; // kg
}

export interface CreateOrderResponse {
    order_id: number;
    shipment_id: number;
    status: string;
    status_code: number;
    onboarding_completed_now: number;
    awb_code: string;
    courier_company_id: string;
    courier_name: string;
}

export interface TrackingActivity {
    date: string;
    status: string;
    activity: string;
    location: string;
}

export interface TrackingResponse {
    tracking_data: {
        track_status: number;
        shipment_status: number;
        shipment_track: {
            id: number;
            awb_code: string;
            courier_company_id: number;
            shipment_id: number;
            order_id: number;
            current_status: string;
            delivered_date: string;
            edd: string; // Estimated delivery date
        }[];
        shipment_track_activities: TrackingActivity[];
    };
}

// ─── API Methods ──────────────────────────────────────────────────

/**
 * Create a new order in Shiprocket.
 */
export async function createShiprocketOrder(
    payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
    return shiprocketFetch('/orders/create/adhoc', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

/**
 * Track a shipment by AWB code.
 */
export async function trackByAWB(awbCode: string): Promise<TrackingResponse> {
    return shiprocketFetch(`/courier/track/awb/${awbCode}`);
}

/**
 * Track a shipment by Shiprocket order ID.
 */
export async function trackByOrderId(
    orderId: number
): Promise<TrackingResponse> {
    return shiprocketFetch(`/courier/track/shipment/${orderId}`);
}

/**
 * Cancel a Shiprocket order.
 */
export async function cancelShiprocketOrder(orderIds: number[]) {
    return shiprocketFetch('/orders/cancel', {
        method: 'POST',
        body: JSON.stringify({ ids: orderIds }),
    });
}

/**
 * Check courier serviceability and rates.
 */
export async function checkServiceability(
    pickupPincode: string,
    deliveryPincode: string,
    weight: number,
    cod: number // 0 or 1
): Promise<any> {
    const params = new URLSearchParams({
        pickup_postcode: pickupPincode,
        delivery_postcode: deliveryPincode,
        weight: weight.toString(),
        cod: cod.toString(),
    });

    return shiprocketFetch(`/courier/serviceability/?${params.toString()}`);
}

/**
 * Check if Shiprocket credentials are configured.
 */
export function isShiprocketConfigured(): boolean {
    return !!(process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD);
}
