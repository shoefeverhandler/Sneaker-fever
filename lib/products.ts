export interface Product {
    id: string;
    title: string;
    price: number;
    compareAtPrice?: number;
    category: string;
    brand: string;
    images: string[];
    description: string;
    sizes: string[];
    colors: { name: string; hex: string }[];
    rating: number;
    reviews: number;
    stock: number;
    model3D?: string;
}

export const products: Product[] = [
    {
        id: '1',
        title: 'Nike Air Max 90',
        price: 12999,
        compareAtPrice: 14999,
        category: 'Lifestyle',
        brand: 'Nike',
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=800',
        ],
        description: 'The Nike Air Max 90 stays true to its OG running roots with the iconic Waffle sole, stitched overlays and classic TPU accents.',
        sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
        colors: [{ name: 'Red', hex: '#EF4444' }, { name: 'Black', hex: '#000000' }, { name: 'White', hex: '#FFFFFF' }],
        rating: 4.8,
        reviews: 128,
        stock: 5,
        model3D: 'shoe.glb'
    },
    {
        id: '2',
        title: 'Adidas Ultraboost',
        price: 16999,
        category: 'Running',
        brand: 'Adidas',
        images: [
            'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800',
        ],
        description: 'Experience epic energy with the new Ultraboost Light, our lightest Ultraboost ever.',
        sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
        colors: [{ name: 'Black', hex: '#000000' }],
        rating: 4.7,
        reviews: 85,
        stock: 10,
    },
    {
        id: '3',
        title: 'Puma RS-X',
        price: 9999,
        category: 'Casual',
        brand: 'Puma',
        images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800'], // Placeholder
        description: 'The RS-X is back. The future-retro silhouette of this sneaker returns with a progressive aesthetic and angular details.',
        sizes: ['UK 6', 'UK 7', 'UK 8'],
        colors: [{ name: 'Blue', hex: '#3B82F6' }],
        rating: 4.5,
        reviews: 42,
        stock: 8,
    },
    {
        id: '4',
        title: 'New Balance 550',
        price: 11999,
        category: 'Lifestyle',
        brand: 'New Balance',
        images: ['https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=800'],
        description: 'Simple & clean, not overbuilt. We recreated a timeless classic with this tribute to 90s pro ballers and the streetwear that defined a hoops generation.',
        sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
        colors: [{ name: 'White', hex: '#FFFFFF' }],
        rating: 4.9,
        reviews: 210,
        stock: 3,
    },
];

export function getProductById(id: string) {
    return products.find(p => p.id === id);
}

export function getAllProducts() {
    return products;
}
