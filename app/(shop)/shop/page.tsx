'use client';

import { useState, useEffect, Suspense } from 'react';
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
import { getProducts, getBrands, urlFor, type SanityProduct, type SanityBrand } from '@/lib/sanity';
import { useSearchParams, useRouter } from 'next/navigation';

const categories = ['Lifestyle', 'Running', 'Basketball', 'Training', 'Casual', 'Sandals', 'Slides'];

function FilterSidebar({
    priceRange,
    setPriceRange,
    selectedCategories,
    setSelectedCategories,
    selectedBrands,
    setSelectedBrands,
    availableBrands
}: {
    priceRange: number[];
    setPriceRange: (v: number[]) => void;
    selectedCategories: string[];
    setSelectedCategories: (v: string[]) => void;
    selectedBrands: string[];
    setSelectedBrands: (v: string[]) => void;
    availableBrands: SanityBrand[];
}) {
    const handleCategoryChange = (cat: string) => {
        if (selectedCategories.includes(cat)) {
            setSelectedCategories(selectedCategories.filter(c => c !== cat));
        } else {
            setSelectedCategories([...selectedCategories, cat]);
        }
    };

    const handleBrandChange = (brand: string) => {
        if (selectedBrands.includes(brand)) {
            setSelectedBrands(selectedBrands.filter(b => b !== brand));
        } else {
            setSelectedBrands([...selectedBrands, brand]);
        }
    };

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
                                    <Checkbox
                                        id={cat}
                                        checked={selectedCategories.includes(cat)}
                                        onCheckedChange={() => handleCategoryChange(cat)}
                                    />
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
                            {availableBrands.map((brand) => (
                                <div key={brand._id} className="flex items-center space-x-3">
                                    <Checkbox
                                        id={brand.slug}
                                        checked={selectedBrands.includes(brand.slug)}
                                        onCheckedChange={() => handleBrandChange(brand.slug)}
                                    />
                                    <label htmlFor={brand.slug} className="text-sm font-medium leading-none cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                                        {brand.name}
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

function ShopContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [priceRange, setPriceRange] = useState([0, 50000]);
    const [sortBy, setSortBy] = useState('featured');
    const [allProducts, setAllProducts] = useState<SanityProduct[]>([]);
    const [availableBrands, setAvailableBrands] = useState<SanityBrand[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, brandsData] = await Promise.all([
                    getProducts(),
                    getBrands()
                ]);
                setAllProducts(productsData);
                setAvailableBrands(brandsData);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch shop data", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Initialize filters from URL
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        const brandParam = searchParams.get('brand');

        if (categoryParam) {
            setSelectedCategories([categoryParam]);
        }
        if (brandParam) {
            setSelectedBrands([brandParam]);
        }
    }, [searchParams]);

    // Update URL when filters change (optional, but good for UX, maybe skip for now to keep simple)
    // Actually, let's keep it simple and just use local state after initialization

    // Filter products
    const filteredProducts = allProducts.filter((p) => {
        const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
        const matchesCategory = selectedCategories.length === 0 || (p.category && selectedCategories.includes(p.category));
        // For brands, p.brand is the name (e.g. "Nike"), but selectedBrands might be slugs or names.
        // My getProduct mapped brand->name. My brands list has names and slugs.
        // Let's assume selectedBrands contains slugs (from URL) or names (if clicked in sidebar?).
        // Sidebar uses 'brand.slug' for ID and check.
        // So selectedBrands are slugs.
        // We need to match p.brand (Name) to selectedBrands (Slugs).
        // This requires finding the brand object for the product's brand name.
        const productBrandSlug = availableBrands.find(b => b.name === p.brand)?.slug;
        const matchesBrand = selectedBrands.length === 0 || (productBrandSlug && selectedBrands.includes(productBrandSlug));

        return matchesPrice && matchesCategory && matchesBrand;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low': return a.price - b.price;
            case 'price-high': return b.price - a.price;
            case 'newest': return (b._id || '').localeCompare(a._id || '');
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
                        <p className="text-muted-foreground mt-2">
                            {loading ? 'Loading...' : `${sortedProducts.length} results`}
                        </p>
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
                                    <FilterSidebar
                                        priceRange={priceRange}
                                        setPriceRange={setPriceRange}
                                        selectedCategories={selectedCategories}
                                        setSelectedCategories={setSelectedCategories}
                                        selectedBrands={selectedBrands}
                                        setSelectedBrands={setSelectedBrands}
                                        availableBrands={availableBrands}
                                    />
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
                            <FilterSidebar
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                                selectedCategories={selectedCategories}
                                setSelectedCategories={setSelectedCategories}
                                selectedBrands={selectedBrands}
                                setSelectedBrands={setSelectedBrands}
                                availableBrands={availableBrands}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <div key={n} className="h-[400px] bg-accent animate-pulse rounded-xl" />
                            ))}
                        </div>
                    ) : sortedProducts.length === 0 ? (
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
                                onClick={() => {
                                    setPriceRange([0, 50000]);
                                    setSelectedCategories([]);
                                    setSelectedBrands([]);
                                    router.push('/shop');
                                }}
                            >
                                Reset Filters
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sortedProducts.map((product) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={product._id}
                                    className="group"
                                >
                                    <Link href={`/product/${product.slug}`}>
                                        <Card className="overflow-hidden border-0 shadow-none hover-lift bg-transparent cursor-pointer">
                                            <div className="relative aspect-square bg-card rounded-xl overflow-hidden mb-4 border border-border/50">
                                                {product.images?.[0] ? (
                                                    <Image
                                                        src={urlFor(product.images[0]).url()}
                                                        alt={product.title}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-accent flex items-center justify-center text-muted-foreground">
                                                        No Image
                                                    </div>
                                                )}
                                                {product.stock !== undefined && product.stock < 5 && product.stock > 0 && (
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

export default function Shop() {
    return (
        <Suspense fallback={<div className="container py-20 text-center">Loading Shop...</div>}>
            <ShopContent />
        </Suspense>
    );
}
