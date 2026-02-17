'use client';

import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AccountPage() {
    const { user } = useUser();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.firstName}!</h1>
                <p className="text-zinc-500">Here's what's happening with your account today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Total Orders</h3>
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">0</p>
                    <Link href="/account/orders" className="text-sm text-blue-600 hover:underline mt-4 inline-block">View History &rarr;</Link>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border border-purple-100 dark:border-purple-800">
                    <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Wishlist</h3>
                    <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">0</p>
                    <Link href="/account/wishlist" className="text-sm text-purple-600 hover:underline mt-4 inline-block">View Saved Items &rarr;</Link>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-100 dark:border-green-800">
                    <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Account Status</h3>
                    <p className="text-lg font-medium text-green-700 dark:text-green-300">Active Member</p>
                    <p className="text-sm text-green-600 mt-1">Since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
            </div>

            <div className="pt-8 border-t">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                <div className="text-center py-12 bg-zinc-50 rounded-lg border border-dashed text-zinc-400">
                    No recent orders found.
                    <div className="mt-4">
                        <Link href="/shop">
                            <Button variant="outline">Start Shopping</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
