'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClerkProvider, UserButton, useUser } from '@clerk/nextjs';
import { LayoutDashboard, ShoppingBag, Heart, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/account' },
    { icon: ShoppingBag, label: 'Orders', href: '/account/orders' },
    { icon: Heart, label: 'Wishlist', href: '/account/wishlist' },
];

function AccountContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, isLoaded } = useUser();

    if (!isLoaded) return <div className="min-h-screen pt-24 container">Loading...</div>;

    return (
        <div className="min-h-screen pt-24 pb-12 bg-zinc-50 dark:bg-zinc-950">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar */}
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
                            <div className="flex items-center gap-4 mb-6">
                                <UserButton afterSignOutUrl="/" />
                                <div className="overflow-hidden">
                                    <p className="font-bold truncate">{user?.fullName}</p>
                                    <p className="text-xs text-zinc-500 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                                </div>
                            </div>

                            <Separator className="mb-6" />

                            <nav className="space-y-2">
                                {sidebarItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                                                isActive
                                                    ? "bg-black text-white shadow-md shadow-black/20"
                                                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                            )}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            <span className="font-medium">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 min-h-[500px] shadow-sm border border-zinc-100 dark:border-zinc-800">
                            {children}
                        </div>
                    </main>

                </div>
            </div>
        </div>
    );
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <AccountContent>{children}</AccountContent>
        </ClerkProvider>
    );
}
