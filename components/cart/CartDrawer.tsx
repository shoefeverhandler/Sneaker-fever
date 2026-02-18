'use client';

import { useCart } from '@/stores/useCart';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
    const { items, isOpen, closeCart, updateQuantity, removeItem } = useCart();
    const totalPrice = items.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
            <SheetContent className="flex flex-col w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Shopping Cart ({items.length})
                    </SheetTitle>
                </SheetHeader>

                <Separator className="my-4" />

                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <ShoppingBag className="w-16 h-16 text-gray-300" />
                            <p className="text-lg font-medium text-gray-500">Your cart is empty</p>
                            <Button onClick={() => closeCart()} variant="outline">
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        <AnimatePresence initial={false}>
                            {items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="flex gap-4"
                                >
                                    <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover mix-blend-multiply"
                                        />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-semibold line-clamp-1">{item.title}</h4>
                                            <p className="text-sm text-gray-500">{item.color} / {item.size}</p>
                                            <p className="font-bold mt-1">₹{item.price.toLocaleString()}</p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center border rounded-md">
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    className="p-1 hover:bg-gray-100 disabled:opacity-50"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.min(item.maxStock, item.quantity + 1))}
                                                    className="p-1 hover:bg-gray-100 disabled:opacity-50"
                                                    disabled={item.quantity >= item.maxStock}
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-red-500 hover:text-red-600 p-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {items.length > 0 && (
                    <SheetFooter className="mt-auto pt-4 border-t">
                        <div className="w-full space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-semibold">₹{totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>₹{totalPrice.toLocaleString()}</span>
                                </div>
                            </div>

                            <Link href="/checkout" onClick={() => closeCart()}>
                                <Button className="w-full h-12 text-lg rounded-full">
                                    Checkout
                                </Button>
                            </Link>
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
}
