import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'homepage',
    title: 'Homepage Settings',
    type: 'document',
    fields: [
        defineField({
            name: 'heroTitle',
            title: 'Hero Title',
            type: 'string',
        }),
        defineField({
            name: 'heroSubtitle',
            title: 'Hero Subtitle',
            type: 'text',
        }),
        defineField({
            name: 'heroProduct',
            title: 'Hero Product',
            type: 'reference',
            to: [{ type: 'product' }],
        }),
        defineField({
            name: 'featuredProducts',
            title: 'Featured Products',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'product' }] }],
        }),
        defineField({
            name: 'collections',
            title: 'Featured Collections',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'collection' }] }],
        }),
    ],
})
