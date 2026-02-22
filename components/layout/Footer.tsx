import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Send, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

const shopLinks = [
    { name: 'All Products', href: '/shop' },
    { name: 'New Arrivals', href: '/shop' },
    { name: 'Brands', href: '/brands' },
];

const supportLinks = [
    { name: 'Help Center', href: '/help' },
    { name: 'Returns & Exchanges', href: '/returns' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Contact Us', href: '/contact' },
];

const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/sneakerfever.in?igsh=MXIxandyeHcxdHdt', label: 'Instagram' },
];

export default function Footer() {
    return (
        <footer className="bg-foreground text-background">
            <div className="container mx-auto px-4">
                {/* Main Footer */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-20">
                    <div className="space-y-5">
                        <h3 className="text-xl font-bold tracking-[0.15em] uppercase">Sneaker Fever</h3>
                        <p className="text-background/50 text-sm leading-relaxed">
                            Curated premium footwear for those who value craftsmanship, comfort, and timeless style.
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="w-9 h-9 rounded-full border border-background/15 flex items-center justify-center text-background/50 hover:text-background hover:border-background/40 transition-colors"
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-[0.2em] mb-6 text-background/70">Shop</h4>
                        <ul className="space-y-3">
                            {shopLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-background/40 hover:text-background transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-[0.2em] mb-6 text-background/70">Support</h4>
                        <ul className="space-y-3">
                            {supportLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-background/40 hover:text-background transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-[0.2em] mb-6 text-background/70">Stay in the loop</h4>
                        <p className="text-sm text-background/40 mb-4">
                            Get first dibs on new drops and exclusive deals.
                        </p>
                        <form className="flex gap-2">
                            <Input
                                type="email"
                                placeholder="Your email"
                                className="bg-background/8 border-background/15 text-background placeholder:text-background/30 text-sm rounded-full h-10 focus-visible:ring-background/30"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="bg-background text-foreground hover:bg-background/90 rounded-full h-10 w-10 shrink-0"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </div>

                <Separator className="bg-background/10" />

                {/* Bottom Bar */}
                <div className="py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-background/30 text-xs">
                        © {new Date().getFullYear()} Sneaker Fever. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/privacy" className="text-xs text-background/30 hover:text-background/60 transition-colors">Privacy Policy</Link>
                        <span className="text-background/30 text-xs hidden sm:inline">|</span>
                        <Link href="/terms" className="text-xs text-background/30 hover:text-background/60 transition-colors">Terms & Conditions</Link>
                        <span className="text-background/30 text-xs hidden sm:inline">|</span>
                        <Link href="/returns" className="text-xs text-background/30 hover:text-background/60 transition-colors">Refund Policy</Link>
                        <span className="text-background/30 text-xs hidden sm:inline">|</span>
                        <Link href="/contact" className="text-xs text-background/30 hover:text-background/60 transition-colors">Contact Us</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
