'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Filter, ArrowRight, SlidersHorizontal } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { getAllProducts } from '@/lib/products';

const categories = ['Lifestyle', 'Running', 'Basketball', 'Training', 'Casual'];
const brands = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Reebok'];

function FilterSidebar({ priceRange, setPriceRange }: { priceRange: number[]; setPriceRange: (v: number[]) => void }) {
    return (
        <div className="space-y-2">
            <Accordion type="multiple" defaultValue={['categories', 'price', 'brands']} className="w-full">
                <AccordionItem value="categories" className="border-none">
                    <AccordionTrigger className="text-sm font-semibold uppercase tracking-wider py-3 hover:no-underline">
                        Categories
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-3 pb-2">
                            {categories.map((cat) => (
                                <div key={cat} className="flex items-center space-x-3">
                                    <Checkbox id={cat} />
                                    <label htmlFor={cat} className="text-sm font-medium leading-none cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                                        {cat}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="price" className="border-none">
                    <AccordionTrigger className="text-sm font-semibold uppercase tracking-wider py-3 hover:no-underline">
                        Price Range
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="pb-2">
                            <Slider
                                max={50000}
                                step={500}
                                value={priceRange}
                                onValueChange={setPriceRange}
                                className="py-4"
                            />
                            <div className="flex justify-between text-xs font-medium text-muted-foreground">
                                <span>₹{priceRange[0].toLocaleString()}</span>
                                <span>₹{priceRange[1].toLocaleString()}+</span>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="brands" className="border-none">
                    <AccordionTrigger className="text-sm font-semibold uppercase tracking-wider py-3 hover:no-underline">
                        Brands
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-3 pb-2">
                            {brands.map((brand) => (
                                <div key={brand} className="flex items-center space-x-3">
                                    <Checkbox id={brand} />
                                    <label htmlFor={brand} className="text-sm font-medium leading-none cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                                        {brand}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}

export default function Shop() {
    const [priceRange, setPriceRange] = useState([0, 20000]);
    const [sortBy, setSortBy] = useState('featured');
    const allProducts = getAllProducts();

    // Filter by price range
    const filtered = allProducts.filter(
        (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    const products = [...filtered].sort((a, b) => {
        switch (sortBy) {
            case 'price-low': return a.price - b.price;
            case 'price-high': return b.price - a.price;
            case 'newest': return b.id.localeCompare(a.id);
            default: return 0;
        }
    });

    return (
        <div className="container mx-auto px-4 pt-4 pb-8">
            {/* Page Header */}
            <div className="mb-10">
                <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-2">Browse</p>
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">All Products</h1>
                        <p className="text-muted-foreground mt-2">{products.length} of {allProducts.length} products</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="md:hidden rounded-full gap-2">
                                    <SlidersHorizontal className="h-4 w-4" /> Filters
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] overflow-y-auto">
                                <div className="py-4">
                                    <h3 className="font-bold text-lg mb-4">Filters</h3>
                                    <FilterSidebar priceRange={priceRange} setPriceRange={setPriceRange} />
                                </div>
                            </SheetContent>
                        </Sheet>

                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[180px] rounded-full">
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="featured">Featured</SelectItem>
                                <SelectItem value="price-low">Price: Low to High</SelectItem>
                                <SelectItem value="price-high">Price: High to Low</SelectItem>
                                <SelectItem value="newest">Newest Arrivals</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="flex gap-12">
                {/* Sidebar Filters (Desktop) */}
                <div className="hidden md:block w-64 flex-shrink-0">
                    <Card className="sticky top-28 border bg-card">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <SlidersHorizontal className="h-4 w-4" />
                                <h3 className="font-semibold text-sm uppercase tracking-wider">Filters</h3>
                            </div>
                            <Separator className="mb-4" />
                            <FilterSidebar priceRange={priceRange} setPriceRange={setPriceRange} />
                        </CardContent>
                    </Card>
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    {products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
                                <SlidersHorizontal className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No products found</h3>
                            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                                Try adjusting your price range or filters to find what you&apos;re looking for.
                            </p>
                            <Button
                                variant="outline"
                                className="rounded-full"
                                onClick={() => setPriceRange([0, 50000])}
                            >
                                Reset Filters
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={product.id}
                                    className="group"
                                >
                                    <Link href={`/product/${product.id}`}>
                                        <Card className="overflow-hidden border-0 shadow-none hover-lift bg-transparent cursor-pointer">
                                            <div className="relative aspect-square bg-card rounded-xl overflow-hidden mb-4 border border-border/50">
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                {product.stock < 5 && product.stock > 0 && (
                                                    <Badge variant="secondary" className="absolute top-3 left-3 rounded-full text-[10px]">
                                                        Only {product.stock} left
                                                    </Badge>
                                                )}
                                                {product.compareAtPrice && (
                                                    <Badge variant="destructive" className="absolute top-3 right-3 rounded-full text-[10px]">
                                                        Sale
                                                    </Badge>
                                                )}
                                            </div>
                                            <CardContent className="p-0 space-y-1">
                                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{product.brand}</p>
                                                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{product.title}</h3>
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
                    )}
                </div>
            </div>
        </div>
    );
}
