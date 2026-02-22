'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Got a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Get in touch</h3>
                        <p className="text-muted-foreground">
                            Our support team is available Monday through Friday, 9am to 6pm IST.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <MapPin className="w-5 h-5 mt-1 text-primary" />
                            <div>
                                <p className="font-medium">Sneaker Fever Head Office</p>
                                <p className="text-muted-foreground">Agra, Uttar Pradesh, India</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Mail className="w-5 h-5 text-primary" />
                            <div>
                                <p className="font-medium">Email</p>
                                <p className="text-muted-foreground">shoefever.handler@gmail.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Phone className="w-5 h-5 text-primary" />
                            <div>
                                <p className="font-medium">Phone</p>
                                <p className="text-muted-foreground text-sm flex flex-col gap-1">
                                    <span>+91 63988 76943</span>
                                    <span>(For Support)</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-muted/30 p-8 rounded-2xl">
                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                                <Input id="firstName" placeholder="John" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                                <Input id="lastName" placeholder="Doe" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                            <Input id="email" type="email" placeholder="john@example.com" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium">Message</label>
                            <Textarea id="message" placeholder="How can we help you?" className="min-h-[150px]" />
                        </div>
                        <Button className="w-full">Send Message</Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
