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
                    We collect information that you provide directly to us when you register an account, make a purchase, sign up for our newsletter, or communicate with us. This may include your name, email address, shipping address, and payment information.
                </p>

                <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
                <p>
                    We use the information we collect to process your orders, communicate with you about your account and our products, improving our website and customer service, and for security and fraud prevention.
                </p>

                <h2 className="text-xl font-semibold text-foreground">3. Information Sharing</h2>
                <p>
                    We do not sell or rent your personal information to third parties. We may share your information with service providers who help us operate our business, such as payment processors and shipping partners.
                </p>

                <h2 className="text-xl font-semibold text-foreground">4. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at support@sneakerfever.com.
                </p>
            </div>
        </div>
    );
}
