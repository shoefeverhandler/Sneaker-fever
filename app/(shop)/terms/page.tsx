import React from 'react';

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
            <div className="prose dark:prose-invert max-w-none space-y-6 text-muted-foreground">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <p>
                    Please read these Terms of Service carefully before using the Sneaker Fever website. By accessing or using our service, you agree to be bound by these terms.
                </p>

                <h2 className="text-xl font-semibold text-foreground">1. Purchases</h2>
                <p>
                    If you wish to purchase any product made available through the Service, you may be asked to supply certain information relevant to your Purchase including, without limitation, your credit card number, the expiration date of your credit card, your billing address, and your shipping information.
                </p>

                <h2 className="text-xl font-semibold text-foreground">2. Accounts</h2>
                <p>
                    When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                </p>

                <h2 className="text-xl font-semibold text-foreground">3. Intellectual Property</h2>
                <p>
                    The Service and its original content, features, and functionality are and will remain the exclusive property of Sneaker Fever and its licensors.
                </p>

                <h2 className="text-xl font-semibold text-foreground">4. Termination</h2>
                <p>
                    We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
            </div>
        </div>
    );
}
