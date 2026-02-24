'use client';

import { useState, useEffect, use } from 'react';
import ProductGallery from '@/components/product/ProductGallery';
import ProductReviews from '@/components/product/ProductReviews';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Heart, Share2, ShieldCheck, RotateCcw, Check, ChevronRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useCart } from '@/stores/useCart';
import { useWishlist } from '@/stores/useWishlist';
import { getProductBySlug, urlFor, type SanityProduct } from '@/lib/sanity';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [product, setProduct] = useState<SanityProduct | null>(null);
    const [loading, setLoading] = useState(true);

    const addItem = useCart((s) => s.addItem);
    const wishlist = useWishlist();

    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');

    useEffect(() => {
        getProductBySlug(slug)
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch product", err);
                setLoading(false);
            });
    }, [slug]);

    if (loading) {
        return <div className="container py-20 text-center">Loading product...</div>;
    }

    if (!product) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold">Product Not Found</h1>
                <p className="text-muted-foreground mt-2">The product you are looking for does not exist.</p>
                <Link href="/shop">
                    <Button variant="outline" className="mt-6 rounded-full">
                        Back to Shop
                    </Button>
                </Link>
            </div>
        );
    }

    const isWishlisted = wishlist.isInWishlist(product._id);
    const discountPercent = product.compareAtPrice
        ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
        : 0;

    // Helper to get image URLs
    const imageUrls = product.images?.map((img) => urlFor(img).url()) || [];

    function handleAddToCart() {
        if (product && product.sizes && product.sizes.length > 0 && !selectedSize) {
            toast.error('Please select a size');
            return;
        }

        if (product) {
            addItem({
                id: `${product._id}-${selectedSize}-${selectedColor}`,
                productId: product._id,
                title: product.title,
                price: product.price,
                image: imageUrls[0] || '',
                size: selectedSize,
                color: selectedColor || undefined,
                quantity: 1,
                maxStock: product.stock || 10,
            });
            toast.success(`${product.title} added to cart`);
        }
    }

    function handleWishlistToggle() {
        if (product) {
            if (isWishlisted) {
                wishlist.removeItem(product._id);
                toast('Removed from wishlist');
            } else {
                wishlist.addItem(product._id);
                toast.success('Added to wishlist');
            }
        }
    }

    function handleShare() {
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: product?.title || 'Product',
                text: `Check out ${product?.title} on Sneaker Fever!`,
                url,
            }).catch(() => { });
        } else {
            navigator.clipboard.writeText(url);
            toast.success('Link copied to clipboard!');
        }
    }

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-8">
                <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                <ChevronRight className="h-3 w-3" />
                <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground font-medium truncate max-w-[200px]">{product.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Gallery */}
                <ProductGallery images={imageUrls} />

                {/* Right: Info */}
                <div className="space-y-8">
                    <div>
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="rounded-full text-[10px] font-semibold uppercase tracking-wider">
                                        {product.brand}
                                    </Badge>
                                    {discountPercent > 0 && (
                                        <Badge variant="destructive" className="rounded-full text-[10px] font-semibold">
                                            {discountPercent}% OFF
                                        </Badge>
                                    )}
                                    {product.stock !== undefined && product.stock < 5 && product.stock > 0 && (
                                        <Badge variant="outline" className="rounded-full text-[10px] font-semibold text-orange-600 border-orange-300">
                                            Only {product.stock} left
                                        </Badge>
                                    )}
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.title}</h1>
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full hover:bg-accent"
                                    onClick={handleShare}
                                >
                                    <Share2 className="h-[18px] w-[18px]" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full hover:bg-accent"
                                    onClick={handleWishlistToggle}
                                >
                                    <Heart
                                        className={`h-[18px] w-[18px] transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : ''
                                            }`}
                                    />
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-border'}`}
                                    />
                                ))}
                                <span className="ml-1 text-sm font-semibold">{product.rating || 'New'}</span>
                            </div>
                            <Separator orientation="vertical" className="h-4" />
                            <span className="text-sm text-muted-foreground">{product.reviews || 0} reviews</span>
                        </div>

                        <div className="flex items-baseline gap-3 mt-4">
                            <p className="text-3xl font-bold">₹{product.price.toLocaleString()}</p>
                            {product.compareAtPrice && (
                                <p className="text-lg text-muted-foreground line-through">₹{product.compareAtPrice.toLocaleString()}</p>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Selectors */}
                    <div className="space-y-6">
                        {product.colors && product.colors.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">
                                    Color
                                    {selectedColor && <span className="text-muted-foreground font-normal normal-case ml-2">— {selectedColor}</span>}
                                </h3>
                                <div className="flex gap-3">
                                    {product.colors.map((color: any) => (
                                        <button
                                            key={color.name || color}
                                            onClick={() => setSelectedColor(color.name || color)}
                                            className={`w-10 h-10 rounded-full border-2 hover:scale-110 transition-all focus:outline-none relative
                                                ${selectedColor === (color.name || color) ? 'border-foreground ring-2 ring-foreground/20' : 'border-border'}`}
                                            style={{ backgroundColor: color.hex || color.value || '#000' }}
                                            title={color.name || color}
                                        >
                                            {selectedColor === (color.name || color) && (
                                                <Check className={`h-4 w-4 absolute inset-0 m-auto ${color.hex === '#FFFFFF' || color.hex === '#ffffff' ? 'text-foreground' : 'text-white'}`} />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.sizes && product.sizes.length > 0 && (
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider">Size</h3>
                                </div>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`py-3 rounded-lg border text-sm font-medium transition-all
                                                ${selectedSize === size
                                                    ? 'border-foreground bg-foreground text-background'
                                                    : 'border-border hover:border-foreground'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            size="lg"
                            className="w-full rounded-full text-sm font-semibold h-14"
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full rounded-full text-sm font-semibold h-14"
                            onClick={() => {
                                handleAddToCart();
                            }}
                        >
                            Buy Now
                        </Button>
                    </div>

                    {/* Trust Badge */}
                    <Card className="border bg-accent/50">
                        <CardContent className="p-4 text-center space-y-1">
                            <RotateCcw className="h-5 w-5 mx-auto text-muted-foreground" />
                            <p className="text-xs font-semibold">Free Returns</p>
                            <p className="text-[10px] text-muted-foreground">7-day policy</p>
                        </CardContent>
                    </Card>

                    {/* Details Accordion */}
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="description">
                            <AccordionTrigger className="text-sm font-semibold uppercase tracking-wider hover:no-underline">
                                Description
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed text-sm">
                                {product.description}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="features">
                            <AccordionTrigger className="text-sm font-semibold uppercase tracking-wider hover:no-underline">
                                Features
                            </AccordionTrigger>
                            <AccordionContent>
                                <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                                    {product.features?.map((feature, i) => (
                                        <li key={i}>{feature}</li>
                                    )) || <li>No features listed</li>}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="delivery">
                            <AccordionTrigger className="text-sm font-semibold uppercase tracking-wider hover:no-underline">
                                Delivery & Returns
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-3 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-3">
                                        <RotateCcw className="h-4 w-4 shrink-0" />
                                        <span>Free 7-day returns</span>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>

            {/* Product Reviews Section */}
            <ProductReviews productId={product._id} />
        </div>
    );
}
