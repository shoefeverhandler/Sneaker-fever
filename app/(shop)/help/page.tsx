import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

export default function HelpPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-center">Help Center</h1>
            <p className="text-center text-muted-foreground mb-12">
                Find answers to common questions about your orders, delivery, and returns.
            </p>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>How do I track my order?</AccordionTrigger>
                    <AccordionContent>
                        Once your order ships, you will receive an email with a tracking number and link. You can also track your order status in your account dashboard.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                    <AccordionContent>
                        We accept all major credit cards, debit cards, UPI, and Net Banking via our secure Razorpay payment gateway.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>Do you ship internationally?</AccordionTrigger>
                    <AccordionContent>
                        Currently, we only ship within India. We plan to expand to international shipping in the near future.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger>Can I cancel my order?</AccordionTrigger>
                    <AccordionContent>
                        You can cancel your order within 24 hours of placing it, provided it has not yet been shipped. Please contact our support team immediately.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                    <AccordionTrigger>How do I determine my shoe size?</AccordionTrigger>
                    <AccordionContent>
                        We provide a size guide on every product page. We recommend measuring your foot and comparing it to our size chart for the best fit.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
