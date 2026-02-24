'use client';

import { useEffect, useState } from 'react';
import { Loader2, Package, Calendar } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import TrackingTimeline from '@/components/order/TrackingTimeline';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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
    // Returns
    updatedAt: string;
    returnStatus?: string;
    returnShiprocketOrderId?: number;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

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

    useEffect(() => {
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

                                <div className="mt-6 pt-4 border-t flex flex-wrap justify-between gap-4">
                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setExpandedOrder(expandedOrder === order._id ? null : order._id)
                                            }
                                        >
                                            {expandedOrder === order._id ? 'Hide Tracking' : 'Track Shipment'}
                                        </Button>

                                        {/* Cancel Button Logic */}
                                        {['processing', 'new'].includes(order.orderStatus) && (
                                            <CancelOrderDialog order={order} onCancelSuccess={fetchOrders} />
                                        )}
                                    </div>

                                    {/* Return Button Logic */}
                                    {order.orderStatus === 'delivered' && (!order.returnStatus || order.returnStatus === 'none') && (
                                        <ReturnOrderDialog order={order} onReturnSuccess={fetchOrders} />
                                    )}

                                    {/* Return Status Badge */}
                                    {order.returnStatus && order.returnStatus !== 'none' && (
                                        <div className="flex items-center gap-2">
                                            <Badge variant={
                                                order.returnStatus === 'completed' ? 'default' :
                                                    order.returnStatus === 'rejected' ? 'destructive' : 'secondary'
                                            }>
                                                Return: {order.returnStatus.charAt(0).toUpperCase() + order.returnStatus.slice(1)}
                                            </Badge>
                                            {order.returnShiprocketOrderId && (
                                                <Button variant="link" size="sm" className="h-auto p-0 text-primary" onClick={() => window.open(`https://shiprocket.co/tracking/${order.returnShiprocketOrderId}`, '_blank')}>
                                                    Track Return
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Tracking Timeline */}
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
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Sub-Component: Return Dialog ─────────────────────────────────

function ReturnOrderDialog({ order, onReturnSuccess }: { order: Order; onReturnSuccess: () => void }) {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    // Calculate if within 7 days
    const deliveryDate = new Date(order.updatedAt); // Assuming updatedAt is delivery date for now
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - deliveryDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isEligible = diffDays <= 7;

    if (!isEligible) return null;

    const handleReturn = async () => {
        if (!reason.trim()) {
            toast.error('Please provide a reason for return');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/orders/return', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: order._id, reason }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Return requested successfully! Review instructions in email.');
                setOpen(false);
                onReturnSuccess();
            } else {
                toast.error(data.error || 'Failed to request return');
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm">Request Return</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Request Return</DialogTitle>
                    <DialogDescription>
                        Returns are accepted within 7 days of delivery. A shipping fee will be deducted from your refund.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Reason for Return</Label>
                        <Textarea
                            placeholder="Please tell us why you want to return this item..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                    <div className="bg-yellow-500/10 p-3 rounded-md text-xs text-yellow-700 dark:text-yellow-400">
                        Note: The original shipping fee will be deducted from your refund.
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
                    <Button onClick={handleReturn} disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Confirm Return
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ─── Sub-Component: Cancel Dialog ─────────────────────────────────

function CancelOrderDialog({ order, onCancelSuccess }: { order: Order; onCancelSuccess: () => void }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCancel = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/orders/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: order._id }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Order cancelled successfully.');
                setOpen(false);
                onCancelSuccess();
            } else {
                toast.error(data.error || 'Failed to cancel order');
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm">Cancel Order</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cancel Order</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to cancel this order? This action cannot be undone.
                        <br /><br />
                        <strong>Note:</strong> Orders can only be cancelled before they are shipped. Once cancelled, your refund will be initiated to the original payment method.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>No, Keep Order</Button>
                    <Button variant="destructive" onClick={handleCancel} disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Yes, Cancel Order
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
