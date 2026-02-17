import { type SchemaTypeDefinition } from 'sanity'
import product from './schemas/product'
import category from './schemas/category'
import brand from './schemas/brand'
import collection from './schemas/collection'
import homepage from './schemas/homepage'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [product, category, brand, collection, homepage],
}
