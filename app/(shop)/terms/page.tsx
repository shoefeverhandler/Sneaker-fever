import React from 'react';

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Terms & Conditions</h1>
            <div className="prose dark:prose-invert max-w-none space-y-6 text-muted-foreground">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <p>
                    Please read these Terms & Conditions carefully before using the Sneaker Fever website. By accessing or using our service, you agree to be bound by these rules.
                </p>

                <h2 className="text-xl font-semibold text-foreground">1. Website Usage Rules</h2>
                <p>
                    You agree to use our website only for lawful purposes. You must not use our website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website.
                </p>

                <h2 className="text-xl font-semibold text-foreground">2. Product Information & Pricing</h2>
                <p>
                    We strive to display our products, including colors and features, as accurately as possible. However, the actual colors you see will depend on your monitor. All prices are prominently displayed and subject to change without notice. Stock availability is subject to change at any time.
                </p>

                <h2 className="text-xl font-semibold text-foreground">3. Order Cancellation Policy</h2>
                <p>
                    Customers can cancel their orders directly from the "Order History" page, but <strong>only if the order has not yet been shipped</strong>. Once an order is processed by the courier and shipped out, the cancellation option will disappear, and the order cannot be cancelled. In such cases, customers must wait for delivery and initiate a return request.
                    <br /><br />
                    Sneaker Fever also reserves the right to cancel orders due to pricing errors, stock unavailability, or suspected fraudulent transactions. If any order is cancelled after payment, a full refund will be issued to the original payment method.
                </p>

                <h2 className="text-xl font-semibold text-foreground">4. Limitation of Liability</h2>
                <p>
                    In no event shall Sneaker Fever, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                </p>

                <h2 className="text-xl font-semibold text-foreground">5. Governing Law</h2>
                <p>
                    These Terms & Conditions shall be governed and construed in accordance with the laws of India, specifically under the jurisdiction of the courts in Jaipur, Rajasthan, without regard to its conflict of law provisions.
                </p>

                <h2 className="text-xl font-semibold text-foreground">6. Contact Information</h2>
                <p>
                    If you have any questions about these Terms, please contact us at support@sneakerfever.store.
                </p>
            </div>
        </div>
    );
}
