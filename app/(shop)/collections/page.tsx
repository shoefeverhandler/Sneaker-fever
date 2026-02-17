'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const collections = [
    {
        id: 'running',
        title: 'Running',
        description: 'Built for speed and endurance. Performance shoes that push your limits.',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1200',
        count: 12,
    },
    {
        id: 'basketball',
        title: 'Basketball',
        description: 'Dominate the court with shoes designed for power and agility.',
        image: 'https://images.unsplash.com/photo-1518002171953-a080ee321e2f?auto=format&fit=crop&q=80&w=1200',
        count: 8,
    },
    {
        id: 'casual',
        title: 'Casual',
        description: 'Everyday comfort meets street-ready style.',
        image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=1200',
        count: 15,
    },
    {
        id: 'lifestyle',
        title: 'Lifestyle',
        description: 'Premium designs that transition seamlessly from day to night.',
        image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=1200',
        count: 10,
    },
];

export default function CollectionsPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-14"
            >
                <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-3">Explore</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Collections</h1>
                <p className="text-muted-foreground max-w-xl">
                    Explore our carefully curated collections designed for every occasion and style.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {collections.map((collection, idx) => (
                    <motion.div
                        key={collection.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Link href={`/shop?category=${collection.id}`}>
                            <Card className="overflow-hidden border-0 shadow-none hover-lift cursor-pointer group">
                                <div className="relative h-[380px] md:h-[420px] rounded-xl overflow-hidden">
                                    <Image
                                        src={collection.image}
                                        alt={collection.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                    <Badge variant="secondary" className="absolute top-5 left-5 rounded-full text-[10px]">
                                        {collection.count} Products
                                    </Badge>
                                    <div className="absolute bottom-0 left-0 right-0 p-8">
                                        <h2 className="text-3xl font-bold text-white mb-2">{collection.title}</h2>
                                        <p className="text-white/70 text-sm mb-4 max-w-sm">{collection.description}</p>
                                        <span className="inline-flex items-center gap-1 text-white/80 text-sm font-medium group-hover:gap-2 transition-all">
                                            Shop Now <ArrowRight className="h-4 w-4" />
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
