import React from 'react';

export default function ShippingPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Shipping Information</h1>
            <div className="prose dark:prose-invert max-w-none space-y-6 text-muted-foreground">
                <p>
                    We act as a platform connecting sellers with buyers. Shipping times and methods may vary depending on the seller and your location.
                </p>

                <h2 className="text-xl font-semibold text-foreground">1. Processing Time</h2>
                <p>
                    Orders are typically processed within 1-2 business days. Once your order has been processed, you will receive a confirmation email with tracking information.
                </p>

                <h2 className="text-xl font-semibold text-foreground">2. Shipping Rates & Delivery Estimates</h2>
                <p>
                    Shipping charges for your order will be calculated and displayed at checkout. Delivery delays can occasionally occur.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Standard Shipping:</strong> 5-7 business days</li>
                    <li><strong>Express Shipping:</strong> 2-3 business days</li>
                </ul>

                <h2 className="text-xl font-semibold text-foreground">3. Shipment Confirmation & Order Tracking</h2>
                <p>
                    You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.
                </p>

                <h2 className="text-xl font-semibold text-foreground">4. Customs, Duties and Taxes</h2>
                <p>
                    Sneaker Fever is not responsible for any customs and taxes applied to your order. All fees imposed during or after shipping are the responsibility of the customer (tariffs, taxes, etc.).
                </p>


            </div>
        </div>
    );
}
