'use client';

import { cn } from '@/lib/utils';
import { Package, Truck, MapPin, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';

interface TrackingTimelineProps {
    currentStatus: string;
    courierName?: string;
    awbCode?: string;
}

const steps = [
    { key: 'processing', label: 'Order Placed', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: Package },
    { key: 'in_transit', label: 'In Transit', icon: Truck },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

const statusOrder = ['processing', 'shipped', 'in_transit', 'out_for_delivery', 'delivered'];

function getStatusIndex(status: string): number {
    const idx = statusOrder.indexOf(status);
    return idx === -1 ? 0 : idx;
}

export default function TrackingTimeline({ currentStatus, courierName, awbCode }: TrackingTimelineProps) {
    const isSpecialStatus = ['cancelled', 'rto'].includes(currentStatus);
    const activeIndex = isSpecialStatus ? -1 : getStatusIndex(currentStatus);

    if (isSpecialStatus) {
        return (
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                {currentStatus === 'rto' ? (
                    <RotateCcw className="w-6 h-6 text-red-500" />
                ) : (
                    <AlertCircle className="w-6 h-6 text-red-500" />
                )}
                <div>
                    <p className="font-semibold text-red-700 dark:text-red-300 capitalize">
                        {currentStatus === 'rto' ? 'Return to Origin' : 'Order Cancelled'}
                    </p>
                    <p className="text-sm text-red-500">
                        {currentStatus === 'rto'
                            ? 'This shipment is being returned to the seller.'
                            : 'This order has been cancelled.'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Courier Info */}
            {(courierName || awbCode) && (
                <div className="flex flex-wrap gap-4 text-sm text-zinc-500 border-b pb-4">
                    {courierName && (
                        <span>
                            Courier: <strong className="text-zinc-800 dark:text-zinc-200">{courierName}</strong>
                        </span>
                    )}
                    {awbCode && (
                        <span>
                            AWB: <strong className="text-zinc-800 dark:text-zinc-200 font-mono">{awbCode}</strong>
                        </span>
                    )}
                </div>
            )}

            {/* Timeline */}
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const isCompleted = index <= activeIndex;
                    const isCurrent = index === activeIndex;
                    const Icon = step.icon;

                    return (
                        <div key={step.key} className="flex flex-col items-center flex-1 relative">
                            {/* Connector line */}
                            {index > 0 && (
                                <div
                                    className={cn(
                                        'absolute top-5 right-1/2 w-full h-0.5 -translate-y-1/2',
                                        index <= activeIndex ? 'bg-green-500' : 'bg-zinc-200 dark:bg-zinc-700'
                                    )}
                                    style={{ zIndex: 0 }}
                                />
                            )}

                            {/* Icon circle */}
                            <div
                                className={cn(
                                    'relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all',
                                    isCompleted
                                        ? 'bg-green-500 text-white shadow-md shadow-green-200'
                                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400',
                                    isCurrent && 'ring-4 ring-green-100 dark:ring-green-900'
                                )}
                            >
                                <Icon className="w-5 h-5" />
                            </div>

                            {/* Label */}
                            <span
                                className={cn(
                                    'text-xs mt-2 text-center font-medium',
                                    isCompleted ? 'text-green-600 dark:text-green-400' : 'text-zinc-400'
                                )}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
