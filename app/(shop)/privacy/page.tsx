import React from 'react';

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
            <div className="prose dark:prose-invert max-w-none space-y-6 text-muted-foreground">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <p>
                    At Sneaker Fever, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
                </p>

                <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
                <p>
                    We collect personal information such as name, email address, phone number, and shipping address when you register an account, make a purchase, sign up for our newsletter, or communicate with us.
                </p>

                <h2 className="text-xl font-semibold text-foreground">2. Why We Collect It</h2>
                <p>
                    We collect this information to process your orders, arrange delivery, provide customer support, and communicate with you about your account securely.
                </p>

                <h2 className="text-xl font-semibold text-foreground">3. Payment Processing</h2>
                <p>
                    Payments on Sneaker Fever are processed securely via the Razorpay payment gateway. We do not store your credit card details or UPI information on our servers. All transaction data is encrypted and handled directly by Razorpay according to their secure data protocols.
                </p>

                <h2 className="text-xl font-semibold text-foreground">4. Cookies Usage</h2>
                <p>
                    We use cookies to enhance your browsing experience, remember your cart items, and analyze site traffic. By using our website, you consent to our use of cookies.
                </p>

                <h2 className="text-xl font-semibold text-foreground">5. Data Protection</h2>
                <p>
                    We do not sell or rent your personal information to third parties. We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. We only share necessary details with trusted service providers (like shipping partners) to fulfill your orders.
                </p>

                <h2 className="text-xl font-semibold text-foreground">6. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy or how your data is handled, please contact us at: <br />
                    <strong>Email:</strong> support@sneakerfever.store
                </p>
            </div>
        </div>
    );
}
