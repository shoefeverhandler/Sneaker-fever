'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowRight, Sparkles, Send, Star, ShieldCheck, RotateCcw, Lock, Award } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getNewArrivals, urlFor, type SanityProduct } from '@/lib/sanity';

const features = [
  { icon: ShieldCheck, title: 'Authentic Products', description: '100% genuine sneakers sourced directly from brands. Every pair is verified.' },
  { icon: RotateCcw, title: 'Easy Returns', description: 'Not the right fit? Return within 7 days, no questions asked.' },
  { icon: Lock, title: 'Secure Payments', description: 'Your transactions are protected with industry-leading encryption.' },
  { icon: Award, title: 'Premium Quality', description: 'Handpicked selection of the finest sneakers from top global brands.' },
];

const brandLogos = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Reebok', 'Converse', 'Vans', 'Jordan'];

export default function Home() {
  const [newArrivals, setNewArrivals] = useState<SanityProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNewArrivals().then((data) => {
      setNewArrivals(data);
      setLoading(false);
    });
  }, []);
  return (
    <div className="overflow-hidden">
      {/* Hero Section — Full-bleed cinematic */}
      <section className="relative min-h-[85vh] flex items-center -mt-24">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=2000"
            alt="Sneaker Collection"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="max-w-2xl"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium text-white/90">New Collection 2026</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter mb-6 leading-[0.9] text-white">
              Step Into{' '}
              <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                Elegance
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg text-white/70 max-w-lg mb-10 leading-relaxed">
              Curated premium footwear for those who value craftsmanship, comfort, and timeless style.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <Link href="/shop">
                <Button size="lg" className="rounded-full px-8 py-6 text-sm font-semibold tracking-wide gap-2 bg-white text-black hover:bg-white/90">
                  Explore Collection
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-sm font-semibold tracking-wide border-white/30 text-white hover:bg-white/10">
                  Our Story
                </Button>
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div variants={fadeInUp} className="flex items-center gap-6 mt-12 pt-8 border-t border-white/10">
              <div>
                <p className="text-2xl font-bold text-white">10K+</p>
                <p className="text-xs text-white/50 uppercase tracking-wider">Happy Customers</p>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <p className="text-2xl font-bold text-white">200+</p>
                <p className="text-xs text-white/50 uppercase tracking-wider">Premium Styles</p>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-white/70 ml-2">4.9/5</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Brand Marquee */}
      <section className="border-y border-border bg-accent/50 py-6 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-16">
          {[...brandLogos, ...brandLogos].map((brand, i) => (
            <span
              key={i}
              className="text-xl font-bold tracking-wider text-muted-foreground/40 uppercase select-none"
            >
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-3">The Sneaker Fever promise</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Why Choose Us
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border bg-card hover-lift transition-shadow hover:shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-6">
                      <feature.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-24 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-14">
            <div>
              <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-3">Fresh drops</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">New Arrivals</h2>
            </div>
            <Link href="/shop" className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square bg-accent animate-pulse rounded-xl" />
              ))
            ) : newArrivals.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/product/${product.slug}`} className="group">
                  <Card className="overflow-hidden border-0 shadow-none hover-lift bg-transparent">
                    <div className="relative aspect-square bg-card rounded-xl overflow-hidden mb-4">
                      {product.images?.[0] ? (
                        <Image
                          src={urlFor(product.images[0]).url()}
                          alt={product.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-accent flex items-center justify-center">No Image</div>
                      )}
                      {product.isNew && (
                        <Badge className="absolute top-3 left-3 rounded-full text-[10px] font-semibold">
                          New
                        </Badge>
                      )}
                      {product.compareAtPrice && (
                        <Badge variant="destructive" className="absolute top-3 right-3 rounded-full text-[10px] font-semibold">
                          -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-0 space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{product.brand}</p>
                      <h3 className="font-semibold text-sm">{product.title}</h3>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm">₹{product.price.toLocaleString()}</p>
                        {product.compareAtPrice && (
                          <p className="text-xs text-muted-foreground line-through">₹{product.compareAtPrice.toLocaleString()}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="sm:hidden mt-8 text-center">
            <Link href="/shop">
              <Button variant="outline" className="rounded-full gap-2">
                View All Products <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden border bg-card">
            <CardContent className="p-12 md:p-16 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-4">Stay in the loop</p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Get Early Access & Exclusive Offers
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Join 10,000+ sneakerheads who get first dibs on new drops, restocks, and member-only deals.
                </p>
                <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="rounded-full h-12 px-6 bg-accent border-border"
                  />
                  <Button type="submit" className="rounded-full h-12 px-8 gap-2 shrink-0">
                    Subscribe <Send className="h-4 w-4" />
                  </Button>
                </form>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
