'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const brands = [
    {
        id: 'nike',
        name: 'Nike',
        tagline: 'Just Do It',
        logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
        description: 'Innovation and technology driven performance wear for athletes worldwide.',
    },
    {
        id: 'adidas',
        name: 'Adidas',
        tagline: 'Impossible Is Nothing',
        logo: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800',
        description: 'Combining sport heritage with street culture for the modern generation.',
    },
    {
        id: 'puma',
        name: 'Puma',
        tagline: 'Forever Faster',
        logo: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=800',
        description: 'Sport-lifestyle brand delivering performance, style, and sustainability.',
    },
    {
        id: 'new-balance',
        name: 'New Balance',
        tagline: 'Fearlessly Independent Since 1906',
        logo: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=800',
        description: 'Crafted with heritage precision and a relentless focus on fit and comfort.',
    },
];

export default function BrandsPage() {
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {brands.map((brand, idx) => (
                    <motion.div
                        key={brand.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Link href={`/shop?brand=${brand.name}`}>
                            <Card className="overflow-hidden border hover-lift cursor-pointer group">
                                <div className="relative h-56 overflow-hidden">
                                    <Image
                                        src={brand.logo}
                                        alt={brand.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                                </div>
                                <CardContent className="p-8 -mt-10 relative z-10">
                                    <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-1">{brand.tagline}</p>
                                    <h2 className="text-2xl font-bold mb-2">{brand.name}</h2>
                                    <p className="text-sm text-muted-foreground mb-4">{brand.description}</p>
                                    <span className="inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all">
                                        Shop {brand.name} <ArrowRight className="h-4 w-4" />
                                    </span>
                                </CardContent>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
