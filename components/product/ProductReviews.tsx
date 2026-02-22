'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { getProductReviews, type SanityReview } from '@/lib/sanity';

interface ProductReviewsProps {
    productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
    const [reviews, setReviews] = useState<SanityReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    // Form state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [userName, setUserName] = useState('');
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (productId) {
            getProductReviews(productId)
                .then(data => {
                    setReviews(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load reviews:", err);
                    setLoading(false);
                });
        }
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userName.trim() || !comment.trim()) {
            toast.error("Please fill out all fields");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    userName,
                    rating,
                    comment,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Review submitted successfully! It will appear once approved.');
                setOpen(false);
                // Reset form
                setUserName('');
                setComment('');
                setRating(5);
            } else {
                toast.error(data.message || 'Failed to submit review');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-12 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Customer Reviews</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        {loading ? 'Crunching numbers...' :
                            reviews.length === 0 ? 'Be the first to review this product!' :
                                `Based on ${reviews.length} review${reviews.length === 1 ? '' : 's'}`}
                    </p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="rounded-full">Write a Review</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Write a Review</DialogTitle>
                            <DialogDescription>
                                Share your thoughts with other sneakerheads.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Rating</label>
                                <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`h-6 w-6 ${star <= (hoverRating || rating)
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-border'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">Your Name</label>
                                <Input
                                    id="name"
                                    placeholder="Jane Doe"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="comment" className="text-sm font-medium">Review</label>
                                <Textarea
                                    id="comment"
                                    placeholder="How was the fit, comfort, and style?"
                                    className="min-h-[100px]"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit Review'}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-12 bg-accent/30 rounded-2xl border border-dashed">
                    <Star className="h-8 w-8 mx-auto text-muted-foreground mb-3 opacity-20" />
                    <p className="text-muted-foreground">No reviews yet. Got something to say?</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {reviews.map((review) => (
                        <div key={review._id} className="p-6 rounded-2xl bg-accent/30 border">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="font-semibold">{review.userName}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-border'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {review.comment}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
