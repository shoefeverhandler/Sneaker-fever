'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import SmoothScrollProvider from '@/components/layout/SmoothScrollProvider';
import SplashScreen from '@/components/animations/SplashScreen';
import dynamic from 'next/dynamic';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';

const Header = dynamic(() => import('@/components/layout/Header'), { ssr: false });

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider>
            <TooltipProvider delayDuration={300}>
                <SmoothScrollProvider>
                    <SplashScreen>
                        <div className="flex flex-col min-h-screen">
                            <Header />
                            <CartDrawer />
                            <main className="flex-grow pt-24">
                                {children}
                            </main>
                            <Footer />
                        </div>
                        <Toaster position="bottom-right" richColors />
                    </SplashScreen>
                </SmoothScrollProvider>
            </TooltipProvider>
        </ClerkProvider>
    );
}
