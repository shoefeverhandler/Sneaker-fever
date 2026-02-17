'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getBrands, urlFor, type SanityBrand } from '@/lib/sanity';

export default function BrandsPage() {
    const [brands, setBrands] = useState<SanityBrand[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getBrands()
            .then((data) => {
                setBrands(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch brands", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="container mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-14"
            >
                <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-3">Partners</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Our Brands</h1>
                <p className="text-muted-foreground max-w-xl">
                    We partner with the world&apos;s most iconic brands to bring you the best in footwear.
                </p>
            </motion.div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-56 bg-accent animate-pulse rounded-xl" />
                    ))}
                </div>
            ) : brands.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">No brands found. Add some in Sanity Studio!</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {brands.map((brand, idx) => (
                        <motion.div
                            key={brand._id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Link href={`/shop?brand=${brand.slug}`}>
                                <Card className="overflow-hidden border hover-lift cursor-pointer group">
                                    <div className="relative h-56 overflow-hidden bg-white dark:bg-zinc-900 flex items-center justify-center p-8">
                                        {brand.logo ? (
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={urlFor(brand.logo).url()}
                                                    alt={brand.name}
                                                    fill
                                                    className="object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-4xl font-bold text-muted-foreground/30">{brand.name}</span>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <CardContent className="p-8 relative z-10 border-t">
                                        {brand.tagline && (
                                            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-1">{brand.tagline}</p>
                                        )}
                                        <h2 className="text-2xl font-bold mb-2">{brand.name}</h2>
                                        {brand.description && (
                                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{brand.description}</p>
                                        )}
                                        <span className="inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all">
                                            Shop {brand.name} <ArrowRight className="h-4 w-4" />
                                        </span>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
