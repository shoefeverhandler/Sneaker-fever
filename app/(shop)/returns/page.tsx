import React from 'react';

export default function ReturnsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Returns & Exchanges</h1>
            <div className="prose dark:prose-invert max-w-none space-y-6 text-muted-foreground">
                <p>
                    We want you to be completely satisfied with your purchase. If you are not happy with your order, we are here to help.
                </p>

                <h2 className="text-xl font-semibold text-foreground">1. Return Policy</h2>
                <p>
                    You have 7 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it. Your item must be in the original packaging.
                </p>

                <h2 className="text-xl font-semibold text-foreground">2. How to Initiate a Return</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Email us at <a href="mailto:support@sneakerfever.com" className="text-primary hover:underline">support@sneakerfever.com</a> with your Order ID and reason for return.</li>
                    <li>Our team will review your request within 24-48 business hours.</li>
                    <li>If approved, we will share instructions on how to ship the product back to us (or schedule a pickup, subject to availability).</li>
                </ul>

                <h2 className="text-xl font-semibold text-foreground">3. Refunds</h2>
                <p>
                    Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.
                </p>
                <p>
                    If your return is approved, we will initiate a refund to your original method of payment (Credit Card, UPI, etc.).
                    <strong>Please note:</strong> The original shipping fee charged at the time of order will be deducted from the total refund amount.
                </p>

                <h2 className="text-xl font-semibold text-foreground">4. Shipping</h2>
                <p>
                    You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
                </p>
                <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 mt-2">
                    <p className="text-yellow-700 dark:text-yellow-400 font-medium text-sm">
                        Note: The shipping fee charged at the time of your order will be deducted from your refund amount.
                    </p>
                </div>

                <h2 className="text-xl font-semibold text-foreground">5. Contact Us</h2>
                <p>
                    If you have any questions on how to return your item to us, contact us at <a href="mailto:support@sneakerfever.com" className="text-primary hover:underline">support@sneakerfever.com</a>.
                </p>
            </div>
        </div>
    );
}
