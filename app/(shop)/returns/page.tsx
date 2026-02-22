import React from 'react';

export default function ReturnsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Refund & Cancellation Policy</h1>
            <div className="prose dark:prose-invert max-w-none space-y-6 text-muted-foreground">
                <p>
                    At Sneaker Fever, we want you to be completely satisfied with your purchase. If you are not happy with your order, our refund and cancellation policy is clearly outlined below.
                </p>

                <h2 className="text-xl font-semibold text-foreground">1. Cancellation Rules</h2>
                <p>
                    Orders can be cancelled before they are dispatched. If you wish to cancel an order, please contact our support team immediately.
                    Once an order has been handed over to our shipping partner, it cannot be cancelled and must be treated as a standard return.
                </p>

                <h2 className="text-xl font-semibold text-foreground">2. Refund Eligibility & Time Window</h2>
                <p>
                    Customers may request a return within <strong>7 days of delivery</strong>. To be eligible for a return and subsequent refund, the item must be requested within this 7-day window.
                </p>

                <h2 className="text-xl font-semibold text-foreground">3. Condition of Product</h2>
                <p>
                    Items must be <strong>unused, unworn, and in their original condition and packaging</strong> (including the original shoebox and any tags).
                    If the product is found to be used, damaged, or missing parts, the return will be rejected and no refund will be issued.
                </p>

                <h2 className="text-xl font-semibold text-foreground">4. Refund Processing Time</h2>
                <p>
                    Once we receive your returned item, our team will inspect it. We will notify you of the approval or rejection of your refund.
                    If approved, refunds are processed within <strong>5–7 business days</strong> after inspection. The refund will be credited back to your original payment method (e.g., Credit Card, UPI via Razorpay).
                </p>

                <h2 className="text-xl font-semibold text-foreground">5. Non-refundable Cases / Deductions</h2>
                <p>
                    The original shipping fee charged at the time of your order is non-refundable. If you receive a refund, the cost of forward shipping will be deducted from your total refund amount. Items purchased on final clearance sale are non-refundable.
                </p>

                <h2 className="text-xl font-semibold text-foreground">6. How to Initiate a Return</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Log into your account and navigate to the <strong>Orders</strong> page to request a return.</li>
                    <li>Alternatively, email us at <a href="mailto:support@sneakerfever.store" className="text-primary hover:underline">support@sneakerfever.store</a> with your Order ID.</li>
                    <li>If approved, we will arrange a return pickup via our shipping partner or provide instructions to mail the item back to our facility.</li>
                </ul>
            </div>
        </div>
    );
}
