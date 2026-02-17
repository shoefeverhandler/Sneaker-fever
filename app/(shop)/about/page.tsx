'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { Zap, Shield, Truck, Heart } from 'lucide-react';

const values = [
    {
        icon: Zap,
        title: 'Premium Quality',
        description: 'Every pair is crafted with the finest materials and cutting-edge technology.',
    },
    {
        icon: Shield,
        title: 'Authenticity Guaranteed',
        description: '100% authentic products sourced directly from authorized brand partners.',
    },
    {
        icon: Truck,
        title: 'Fast Delivery',
        description: 'Free express shipping across India with real-time tracking.',
    },
    {
        icon: Heart,
        title: 'Customer First',
        description: '30-day hassle-free returns and dedicated customer support.',
    },
];

const stats = [
    { value: '10K+', label: 'Happy Customers' },
    { value: '99%', label: 'Satisfaction Rate' },
];

export default function AboutPage() {
    return (
        <div className="overflow-hidden">
            {/* Hero */}
            <section className="relative h-[55vh] flex items-center">
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=1600"
                        alt="About Sneaker Fever"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div initial="initial" animate="animate" variants={staggerContainer}>
                        <motion.p variants={fadeInUp} className="text-sm font-semibold tracking-widest text-white/60 uppercase mb-4">
                            Our Story
                        </motion.p>
                        <motion.h1
                            variants={fadeInUp}
                            className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-4"
                        >
                            About Sneaker Fever
                        </motion.h1>
                        <motion.p
                            variants={fadeInUp}
                            className="text-lg text-white/70 max-w-xl"
                        >
                            Where curated craftsmanship meets modern shopping — premium footwear, reimagined.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Strip */}
            <section className="bg-foreground text-background py-10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 gap-8 text-center max-w-3xl mx-auto">
                        {stats.map((stat) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <p className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</p>
                                <p className="text-xs font-medium text-background/50 uppercase tracking-wider">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-3">The beginning</p>
                            <h2 className="text-4xl font-bold tracking-tight mb-6">Our Story</h2>
                            <Separator className="mb-6 w-16" />
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>
                                    Born from a passion for sneaker culture and a frustration with generic online stores,
                                    Sneaker Fever was founded to create a shopping experience as exciting as the shoes themselves.
                                </p>
                                <p>
                                    We believe buying shoes should be immersive. That&apos;s why we built an experience with
                                    smooth animations and a gallery-like interface that lets you feel
                                    the shoe before it even arrives.
                                </p>
                                <p>
                                    Every brand on our platform is hand-picked. Every shoe is authenticated.
                                    Every delivery is tracked in real-time.
                                </p>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative h-[480px] rounded-2xl overflow-hidden"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1000"
                                alt="Sneaker collection"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 bg-accent/30">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-14"
                    >
                        <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-3">What we stand for</p>
                        <h2 className="text-4xl font-bold tracking-tight">Why Sneaker Fever</h2>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, idx) => {
                            const Icon = value.icon;
                            return (
                                <motion.div
                                    key={value.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Card className="text-center border bg-card hover-lift h-full">
                                        <CardContent className="p-8 space-y-4">
                                            <div className="w-12 h-12 mx-auto rounded-full bg-accent flex items-center justify-center">
                                                <Icon className="w-5 h-5 text-foreground" />
                                            </div>
                                            <h3 className="font-semibold">{value.title}</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
