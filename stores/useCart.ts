import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
    id: string;
    productId: string;
    title: string;
    price: number;
    image: string;
    size: string;
    color?: string;
    quantity: number;
    maxStock: number;
}

interface CartStore {
    items: CartItem[];
    isOpen: boolean;

    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;

    toggleCart: () => void;

    get count(): number;
    get totalPrice(): number;
}

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (item) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((i) => i.id === item.id);

                if (existingItem) {
                    set({
                        items: currentItems.map((i) =>
                            i.id === item.id
                                ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.maxStock) }
                                : i
                        ),
                        isOpen: true,
                    });
                } else {
                    set({ items: [...currentItems, item], isOpen: true });
                }
            },

            removeItem: (id) => {
                set({ items: get().items.filter((i) => i.id !== id) });
            },

            updateQuantity: (id, quantity) => {
                set({
                    items: get().items.map((i) =>
                        i.id === id ? { ...i, quantity } : i
                    ),
                });
            },

            clearCart: () => set({ items: [] }),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            toggleCart: () => set({ isOpen: !get().isOpen }),

            get count() {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            get totalPrice() {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
            },
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
            // Only persist the items array, not the isOpen state
            partialize: (state) => ({ items: state.items }),
        }
    )
);
