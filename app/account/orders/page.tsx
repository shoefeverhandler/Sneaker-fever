'use client';

import { useEffect, useState } from 'react';
import { Loader2, Package, Calendar } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import TrackingTimeline from '@/components/order/TrackingTimeline';

interface OrderItem {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
    size: string;
}

interface Order {
    _id: string;
    totalAmount: number;
    orderStatus: string;
    createdAt: string;
    items: OrderItem[];
    shippingAddress: { city: string };
    awbCode?: string;
    courierName?: string;
    shiprocketOrderId?: number;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await fetch('/api/orders');
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data.orders);
                }
            } catch (error) {
                console.error('Failed to fetch orders', error);
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    function getStatusBadgeVariant(status: string) {
        switch (status) {
            case 'delivered': return 'default';
            case 'cancelled':
            case 'rto': return 'destructive';
            default: return 'secondary';
        }
    }

    function getStatusLabel(status: string) {
        const labels: Record<string, string> = {
            processing: 'Processing',
            shipped: 'Shipped',
            in_transit: 'In Transit',
            out_for_delivery: 'Out for Delivery',
            delivered: 'Delivered',
            cancelled: 'Cancelled',
            rto: 'Returning',
        };
        return labels[status] || status;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Order History</h1>

            {orders.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                    <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">You haven&apos;t placed any orders yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            {/* Header */}
                            <div className="bg-gray-50 dark:bg-zinc-800/50 border-b px-6 py-4 flex flex-wrap justify-between items-center gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Order ID</p>
                                    <p className="font-mono text-sm">#{order._id.slice(-6)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Date</p>
                                    <div className="flex items-center gap-1 text-sm">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Total</p>
                                    <p className="font-bold">₹{order.totalAmount.toLocaleString()}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Status</p>
                                    <Badge variant={getStatusBadgeVariant(order.orderStatus) as any} className="capitalize">
                                        {getStatusLabel(order.orderStatus)}
                                    </Badge>
                                </div>
                            </div>

                            {/* Item List */}
                            <div className="p-6">
                                <div className="space-y-4">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 items-center">
                                            <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                                <Image src={item.image} alt={item.title} fill className="object-cover mix-blend-multiply" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium">{item.title}</h4>
                                                <p className="text-sm text-gray-500">Size: {item.size} | Qty: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">₹{item.price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Track Shipment Button & Timeline */}
                                <div className="mt-6 pt-4 border-t">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setExpandedOrder(expandedOrder === order._id ? null : order._id)
                                        }
                                    >
                                        {expandedOrder === order._id ? 'Hide Tracking' : 'Track Shipment'}
                                    </Button>

                                    {expandedOrder === order._id && (
                                        <div className="mt-4 p-4 bg-gray-50 dark:bg-zinc-800/30 rounded-xl">
                                            <TrackingTimeline
                                                currentStatus={order.orderStatus}
                                                courierName={order.courierName}
                                                awbCode={order.awbCode}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
