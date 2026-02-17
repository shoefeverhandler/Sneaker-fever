import mongoose, { Schema, Model } from 'mongoose';

export interface IOrder {
    userId: string;
    items: {
        productId: string;
        title: string;
        price: number;
        quantity: number;
        size: string;
        color?: string;
        image: string;
    }[];
    shippingAddress: {
        name: string;
        address: string;
        city: string;
        state: string;
        pincode: string;
        phone: string;
    };
    totalAmount: number;
    paymentId: string;
    paymentStatus: 'pending' | 'completed' | 'failed';
    orderStatus: 'processing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'rto';
    // Shiprocket fields
    shiprocketOrderId?: number;
    shiprocketShipmentId?: number;
    awbCode?: string;
    courierName?: string;
    trackingUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
    {
        userId: { type: String, required: true },
        items: [
            {
                productId: { type: String, required: true },
                title: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true },
                size: { type: String, required: true },
                color: { type: String },
                image: { type: String, required: true },
            },
        ],
        shippingAddress: {
            name: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
            phone: { type: String, required: true },
        },
        totalAmount: { type: Number, required: true },
        paymentId: { type: String, required: true },
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
        },
        orderStatus: {
            type: String,
            enum: ['processing', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'rto'],
            default: 'processing',
        },
        // Shiprocket
        shiprocketOrderId: { type: Number },
        shiprocketShipmentId: { type: Number },
        awbCode: { type: String },
        courierName: { type: String },
        trackingUrl: { type: String },
    },
    { timestamps: true }
);

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
