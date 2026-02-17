'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Heart, Search, Menu, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/stores/useCart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

const navLinks = [
    { name: 'Shop', href: '/shop' },
    { name: 'Collections', href: '/collections' },
    { name: 'Brands', href: '/brands' },
    { name: 'About', href: '/about' },
];

export default function Header() {
    const pathname = usePathname();
    const cartCount = useCart((state) => state.items.reduce((t, i) => t + i.quantity, 0));
    const openCart = useCart((state) => state.openCart);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-background',
                isScrolled
                    ? 'border-b border-border/50 py-3 shadow-sm backdrop-blur-md'
                    : 'py-4'
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Mobile Menu */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-accent">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[380px]">
                            <div className="mt-8 mb-6">
                                <Link href="/" className="text-2xl font-bold tracking-tighter uppercase">
                                    Sneaker Fever
                                </Link>
                            </div>
                            <Separator className="mb-6" />
                            <nav className="flex flex-col gap-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            'text-lg font-medium px-4 py-3 rounded-lg transition-colors',
                                            pathname === link.href
                                                ? 'bg-primary text-primary-foreground'
                                                : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                                        )}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Logo */}
                <Link href="/" className="text-xl font-bold tracking-[0.15em] uppercase hover:opacity-80 transition-opacity">
                    <span className="hidden sm:inline">Sneaker Fever</span>
                    <span className="sm:hidden">SF</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'text-sm font-medium px-4 py-2 rounded-full transition-all relative',
                                pathname === link.href
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full hover:bg-accent">
                                <Search className="h-[18px] w-[18px]" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Search</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href="/account/wishlist">
                                <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full hover:bg-accent">
                                    <Heart className="h-[18px] w-[18px]" />
                                </Button>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>Wishlist</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative rounded-full hover:bg-accent"
                                onClick={openCart}
                            >
                                <ShoppingBag className="h-[18px] w-[18px]" />
                                {cartCount > 0 && (
                                    <Badge
                                        className="absolute -top-1 -right-1 h-[18px] min-w-[18px] px-1 text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background"
                                    >
                                        {cartCount}
                                    </Badge>
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Cart</TooltipContent>
                    </Tooltip>

                    <div className="ml-1">
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal">
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent">
                                    <User className="h-[18px] w-[18px]" />
                                </Button>
                            </SignInButton>
                        </SignedOut>
                    </div>
                </div>
            </div>
        </header>
    );
}
