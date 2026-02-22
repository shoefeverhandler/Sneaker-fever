import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { projectId, dataset, apiVersion } from '@/sanity/env';

// We need a custom client here that has a write token
const writeClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_API_WRITE_TOKEN,
});

export async function POST(req: Request) {
    try {
        const { productId, userName, rating, comment } = await req.json();

        // Basic validation
        if (!productId || !userName || !rating || !comment) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { message: 'Rating must be between 1 and 5' },
                { status: 400 }
            );
        }

        if (!process.env.SANITY_API_WRITE_TOKEN) {
            console.error("Missing SANITY_API_WRITE_TOKEN in environment variables.");
            return NextResponse.json(
                { message: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Attempt to write the document to Sanity
        const newReview = await writeClient.create({
            _type: 'review',
            product: {
                _type: 'reference',
                _ref: productId,
            },
            userName,
            rating,
            comment,
            isApproved: false, // Moderated by default
            createdAt: new Date().toISOString(),
        });

        return NextResponse.json(
            { message: 'Review submitted successfully', review: newReview },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error submitting review:', error);
        return NextResponse.json(
            { message: 'Failed to submit review' },
            { status: 500 }
        );
    }
}
