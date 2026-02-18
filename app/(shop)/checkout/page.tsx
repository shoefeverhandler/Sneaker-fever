'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCart } from '@/stores/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const shippingSchema = z.object({
    fullName: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().min(10, 'Invalid phone number'),
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().min(6, 'Invalid pincode'),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

export default function CheckoutPage() {
    const router = useRouter();
    const { items, totalPrice, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);

    // Shipping State
    const [shippingRate, setShippingRate] = useState<number | null>(null);
    const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
    const [shippingError, setShippingError] = useState<string | null>(null);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<ShippingFormData>({
        resolver: zodResolver(shippingSchema),
    });

    const pincode = watch('pincode');

    // Fetch Shipping Rates when Pincode changes
    const [debouncedPincode, setDebouncedPincode] = useState(pincode);

    // Debounce effect
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedPincode(pincode);
        }, 500); // 500ms delay
        return () => clearTimeout(handler);
    }, [pincode]);

    // Fetch Rates Effect
    useEffect(() => {
        if (debouncedPincode && debouncedPincode.length === 6) {
            setIsCalculatingShipping(true);
            setShippingError(null);

            fetch('/api/shiprocket/check-serviceability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deliveryPincode: debouncedPincode, weight: 0.5, cod: 0 }),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.rate !== undefined) {
                        setShippingRate(data.rate);
                        setShippingError(null);
                    } else {
                        setShippingRate(null);
                        setShippingError(data.error || 'Shipping not available');
                    }
                })
                .catch((err) => {
                    console.error(err);
                    setShippingRate(null);
                    setShippingError('Failed to calculate shipping');
                })
                .finally(() => setIsCalculatingShipping(false));
        } else {
            setShippingRate(null);
            setShippingError(null);
        }
    }, [debouncedPincode]);


    const onSubmit = async (data: ShippingFormData) => {
        setIsProcessing(true);
        try {
            // 1. Create Order on Server
            const res = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: totalPrice }),
            });

            if (!res.ok) throw new Error('Order creation failed');

            const { orderId } = await res.json();

            // 2. Initialize Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: totalPrice * 100,
                currency: 'INR',
                name: 'Sneaker Fever',
                description: 'Purchase Payment',
                order_id: orderId,
                handler: async function (response: any) {
                    // 3. Verify Payment
                    const verifyRes = await fetch('/api/payment/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderDetails: {
                                items: items,
                                shippingAddress: data,
                                totalAmount: totalPrice
                            }
                        }),
                    });

                    if (verifyRes.ok) {
                        clearCart();
                        toast.success('Order placed successfully!');
                        router.push('/account/orders'); // Redirect to orders page
                    } else {
                        toast.error('Payment verification failed');
                    }
                },
                prefill: {
                    name: data.fullName,
                    email: data.email,
                    contact: data.phone,
                },
                theme: {
                    color: '#000000',
                },
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error(error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <Button onClick={() => router.push('/shop')}>Go Shopping</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Shipping Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName">Full Name</Label>
                                        <Input id="fullName" {...register('fullName')} placeholder="John Doe" />
                                        {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input id="phone" {...register('phone')} placeholder="+91 98765 43210" />
                                        {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" {...register('email')} placeholder="john@example.com" />
                                    {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" {...register('address')} placeholder="123 Street Name, Apartment 4B" />
                                    {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" {...register('city')} placeholder="New Delhi" />
                                        {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="state">State</Label>
                                        <Input id="state" {...register('state')} placeholder="Delhi" />
                                        {errors.state && <p className="text-red-500 text-xs">{errors.state.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="pincode">Pincode</Label>
                                        <Input id="pincode" {...register('pincode')} placeholder="110001" />
                                        {errors.pincode && <p className="text-red-500 text-xs">{errors.pincode.message}</p>}
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-4 rounded-lg border border-green-200">
                        <ShieldCheck className="h-5 w-5" />
                        <span>Ordering is 100% safe and secure. Payments processed via Razorpay.</span>
                    </div>
                </div>

                {/* Right: Order Summary */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                            <Image src={item.image} alt={item.title} fill className="object-cover mix-blend-multiply" />
                                        </div>
                                        <div className="flex-1 text-sm">
                                            <p className="font-semibold line-clamp-1">{item.title}</p>
                                            <p className="text-gray-500">Qty: {item.quantity}</p>
                                            <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator />

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span>₹{totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Shipping</span>
                                    {isCalculatingShipping ? (
                                        <span className="text-muted-foreground animate-pulse">Calculating...</span>
                                    ) : shippingError ? (
                                        <span className="text-red-500 text-xs">{shippingError}</span>
                                    ) : shippingRate !== null ? (
                                        <span className="font-medium">₹{shippingRate}</span>
                                    ) : (
                                        <span className="text-muted-foreground text-xs">Enter Pincode</span>
                                    )}
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                                    <span>Total</span>
                                    <span>₹{(totalPrice + (shippingRate || 0)).toLocaleString()}</span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                form="checkout-form"
                                className="w-full h-12 text-lg rounded-full"
                                disabled={isProcessing || isCalculatingShipping || (shippingRate === null && !shippingError)} // Disable if no rate unless error (allow retry?) actually blocks if no rate
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    `Pay ₹${(totalPrice + (shippingRate || 0)).toLocaleString()}`
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Load Razorpay Script */}
            <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
        </div>
    );
}
