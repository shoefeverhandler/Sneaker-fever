import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'review',
    title: 'Review',
    type: 'document',
    fields: [
        defineField({
            name: 'product',
            title: 'Product',
            type: 'reference',
            to: [{ type: 'product' }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'userName',
            title: 'User Name',
            type: 'string',
            validation: (Rule) => Rule.required().min(2).max(50),
        }),
        defineField({
            name: 'rating',
            title: 'Rating (1-5)',
            type: 'number',
            validation: (Rule) => Rule.required().min(1).max(5),
        }),
        defineField({
            name: 'comment',
            title: 'Review Comment',
            type: 'text',
            validation: (Rule) => Rule.required().min(5).max(1000),
        }),
        defineField({
            name: 'isApproved',
            title: 'Approved',
            description: 'Check to publish this review on the live site',
            type: 'boolean',
            initialValue: false, // Default to false so owner can moderate
        }),
        defineField({
            name: 'createdAt',
            title: 'Created At',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
    ],
    preview: {
        select: {
            title: 'userName',
            subtitle: 'product.title',
            rating: 'rating',
        },
        prepare(selection) {
            const { title, subtitle, rating } = selection;
            return {
                title: `${title} - ${rating} Stars`,
                subtitle: `For: ${subtitle}`,
            };
        },
    },
});
