import mongoose, { Schema, Model } from 'mongoose';

export interface IWishlist {
    userId: string;
    productIds: string[];
    createdAt: Date;
    updatedAt: Date;
}

const WishlistSchema = new Schema<IWishlist>(
    {
        userId: { type: String, required: true, unique: true },
        productIds: [{ type: String }],
    },
    { timestamps: true }
);

const Wishlist: Model<IWishlist> = mongoose.models.Wishlist || mongoose.model<IWishlist>('Wishlist', WishlistSchema);

export default Wishlist;
