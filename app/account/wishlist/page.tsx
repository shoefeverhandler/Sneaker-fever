'use client';

import { useEffect, useState } from 'react';
import { useWishlist } from '@/stores/useWishlist';
import { getProductsByIds, urlFor, type SanityProduct } from '@/lib/sanity';
import { Heart, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function WishlistPage() {
    const { items, removeItem } = useWishlist();
    const [wishlistProducts, setWishlistProducts] = useState<SanityProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (items.length > 0) {
            getProductsByIds(items)
                .then((data) => {
                    setWishlistProducts(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Failed to fetch wishlist products", err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
            setWishlistProducts([]);
        }
    }, [items]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Wishlist ({items.length})</h1>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="aspect-square bg-accent animate-pulse rounded-xl" />
                    ))}
                </div>
            ) : wishlistProducts.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                    <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Your wishlist is empty.</p>
                    <Link href="/shop" className="mt-4 inline-block">
                        <Button variant="outline">Start Shopping</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistProducts.map(product => (product &&
                        <div key={product._id} className="group border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 bg-card">
                            <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-accent/20">
                                {product.images?.[0] ? (
                                    <Image
                                        src={urlFor(product.images[0]).url()}
                                        alt={product.title}
                                        fill
                                        className="object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">No Image</div>
                                )}
                                <div className="absolute top-3 right-3">
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="rounded-full w-8 h-8 bg-white/80 backdrop-blur-sm hover:bg-red-50 hover:text-red-500"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeItem(product._id);
                                        }}
                                    >
                                        <Heart className="w-4 h-4 fill-current text-red-500" />
                                    </Button>
                                </div>
                            </Link>

                            <div className="p-4">
                                <Link href={`/product/${product.slug}`}>
                                    <h3 className="font-semibold truncate">{product.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold">₹{product.price.toLocaleString()}</span>
                                        <Link href={`/product/${product.slug}`}>
                                            <Button size="sm" variant="outline" className="rounded-full">
                                                <ShoppingBag className="w-4 h-4 mr-2" /> Add
                                            </Button>
                                        </Link>
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
