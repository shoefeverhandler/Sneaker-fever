import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface WishlistStore {
    items: string[]; // Store product IDs
    addItem: (productId: string) => void;
    removeItem: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => void;
}

export const useWishlist = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (productId) => {
                const currentItems = get().items;
                if (!currentItems.includes(productId)) {
                    set({ items: [...currentItems, productId] });
                }
            },

            removeItem: (productId) => {
                set({ items: get().items.filter((id) => id !== productId) });
            },

            isInWishlist: (productId) => {
                return get().items.includes(productId);
            },

            clearWishlist: () => set({ items: [] }),
        }),
        {
            name: 'wishlist-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
