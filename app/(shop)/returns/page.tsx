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
                    You have 30 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it. Your item must be in the original packaging.
                </p>

                <h2 className="text-xl font-semibold text-foreground">2. Refunds</h2>
                <p>
                    Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item. If your return is approved, we will initiate a refund to your credit card (or original method of payment).
                </p>

                <h2 className="text-xl font-semibold text-foreground">3. Shipping</h2>
                <p>
                    You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
                </p>

                <h2 className="text-xl font-semibold text-foreground">4. Contact Us</h2>
                <p>
                    If you have any questions on how to return your item to us, contact us at support@sneakerfever.com.
                </p>
            </div>
        </div>
    );
}
