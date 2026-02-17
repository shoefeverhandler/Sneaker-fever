import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

import { apiVersion, dataset, projectId } from '../sanity/env';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false to see updates immediately (good for dev)
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

// Interfaces
export interface SanityProduct {
  _id: string;
  title: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images: any[];
  brand: string;
  category: string;
  sizes?: string[];
  colors?: any[];
  stock?: number;
  description?: string;
  features?: string[];
  rating?: number;
  reviews?: number;
  isNew?: boolean;
}

export interface SanityBrand {
  _id: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  logo?: any;
}

// Data fetching functions
export async function getBrands(): Promise<SanityBrand[]> {
  return client.fetch(`*[_type == "brand"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    tagline,
    description,
    logo
  }`);
}

export async function getProducts(): Promise<SanityProduct[]> {
  return client.fetch(`*[_type == "product"] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    price,
    compareAtPrice,
    images,
    "brand": brand->name,
    "category": category->title,
    sizes,
    colors,
    stock,
    description,
    features,
    rating,
    reviews,
    "isNew": true // For now, treat all fetched as new or derived from date
  }`);
}

export async function getNewArrivals(): Promise<SanityProduct[]> {
  // Fetch latest 4 products
  return client.fetch(`*[_type == "product"] | order(_createdAt desc)[0...4] {
    _id,
    title,
    "slug": slug.current,
    price,
    compareAtPrice,
    images,
    "brand": brand->name,
    "isNew": true
  }`);
}

export async function getProductBySlug(slug: string): Promise<SanityProduct> {
  return client.fetch(`*[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    price,
    compareAtPrice,
    images,
    "brand": brand->name,
    "rating": rating,
    "reviews": reviews
  }`, { slug });
}

export async function getProductsByIds(ids: string[]): Promise<SanityProduct[]> {
  return client.fetch(`*[_type == "product" && _id in $ids] {
    _id,
    title,
    "slug": slug.current,
    price,
    compareAtPrice,
    images,
    "brand": brand->name,
    "stock": stock
  }`, { ids });
}
