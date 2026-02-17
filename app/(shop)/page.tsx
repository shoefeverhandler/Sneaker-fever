'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowRight, Sparkles, Send, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const collections = [
  { id: 'running', title: 'Running', subtitle: '42 Products', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000' },
  { id: 'basketball', title: 'Basketball', subtitle: '28 Products', image: 'https://images.unsplash.com/photo-1518002171953-a080ee321e2f?auto=format&fit=crop&q=80&w=1000' },
  { id: 'casual', title: 'Casual', subtitle: '56 Products', image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=1000' },
];

const newArrivals = [
  { id: '1', title: 'Nike Air Max 90', price: 12999, compareAt: 15999, brand: 'Nike', isNew: true, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800' },
  { id: '2', title: 'Adidas Ultraboost', price: 16999, brand: 'Adidas', isNew: true, image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800' },
  { id: '3', title: 'Puma RS-X', price: 9999, brand: 'Puma', isNew: false, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=800' },
  { id: '4', title: 'New Balance 550', price: 11999, compareAt: 14999, brand: 'New Balance', isNew: true, image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=800' },
];

const brandLogos = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Reebok', 'Converse', 'Vans', 'Jordan'];

export default function Home() {
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

      {/* Featured Collections */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-3">Shop by style</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Curated Collections
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.map((collection, i) => (
              <Link key={collection.id} href={`/shop?category=${collection.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="overflow-hidden group cursor-pointer border-0 shadow-none hover-lift">
                    <div className="relative h-[420px] overflow-hidden rounded-xl">
                      <Image
                        src={collection.image}
                        alt={collection.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <p className="text-white/70 text-sm font-medium mb-1">{collection.subtitle}</p>
                        <h3 className="text-3xl font-bold text-white mb-3">{collection.title}</h3>
                        <span className="inline-flex items-center gap-1 text-white/80 text-sm font-medium group-hover:gap-2 transition-all">
                          Shop Now <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </Link>
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
            {newArrivals.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/product/${product.id}`} className="group">
                  <Card className="overflow-hidden border-0 shadow-none hover-lift bg-transparent">
                    <div className="relative aspect-square bg-card rounded-xl overflow-hidden mb-4">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {product.isNew && (
                        <Badge className="absolute top-3 left-3 rounded-full text-[10px] font-semibold">
                          New
                        </Badge>
                      )}
                      {product.compareAt && (
                        <Badge variant="destructive" className="absolute top-3 right-3 rounded-full text-[10px] font-semibold">
                          -{Math.round(((product.compareAt - product.price) / product.compareAt) * 100)}%
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-0 space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{product.brand}</p>
                      <h3 className="font-semibold text-sm">{product.title}</h3>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm">₹{product.price.toLocaleString()}</p>
                        {product.compareAt && (
                          <p className="text-xs text-muted-foreground line-through">₹{product.compareAt.toLocaleString()}</p>
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
