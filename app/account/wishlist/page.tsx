'use client';

import { useWishlist } from '@/stores/useWishlist';
import { getProductById } from '@/lib/products';
import { Heart, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function WishlistPage() {
    const { items, removeItem } = useWishlist();

    // Get full product details for wishlisted IDs
    const wishlistProducts = items
        .map(id => getProductById(id))
        .filter(p => p !== undefined);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Wishlist ({items.length})</h1>

            {wishlistProducts.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                    <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Your wishlist is empty.</p>
                    <Link href="/shop" className="mt-4 inline-block">
                        <Button variant="outline">Explore Collections</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistProducts.map(product => (product &&
                        <div key={product.id} className="group border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
                            <Link href={`/product/${product.id}`} className="block relative aspect-square bg-gray-100">
                                <Image
                                    src={product.images[0]}
                                    alt={product.title}
                                    fill
                                    className="object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 right-3">
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="rounded-full w-8 h-8 bg-white/80 backdrop-blur-sm hover:bg-red-50 hover:text-red-500"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeItem(product.id);
                                        }}
                                    >
                                        <Heart className="w-4 h-4 fill-current text-red-500" />
                                    </Button>
                                </div>
                            </Link>

                            <div className="p-4">
                                <Link href={`/product/${product.id}`}>
                                    <h3 className="font-semibold truncate">{product.title}</h3>
                                    <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold">₹{product.price.toLocaleString()}</span>
                                        <Button size="sm" variant="outline" className="rounded-full">
                                            <ShoppingBag className="w-4 h-4 mr-2" /> Add
                                        </Button>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
