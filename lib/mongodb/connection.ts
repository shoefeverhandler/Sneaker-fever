import mongoose, { Mongoose } from 'mongoose';

/**
 * Singleton MongoDB connection using globalThis.
 *
 * In Next.js dev mode, every file is re-evaluated on HMR, which means
 * a naïve `mongoose.connect()` call would open a brand-new pool each
 * time a module hot-reloads. Caching the connection promise on
 * `globalThis` ensures we reuse the same pool across reloads.
 */

interface MongooseCache {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

/* Extend the global type so TypeScript is happy */
declare global {
    // eslint-disable-next-line no-var
    var mongooseCache: MongooseCache | undefined;
}

/* Initialise the cache once on the global object */
const cached: MongooseCache = globalThis.mongooseCache ?? {
    conn: null,
    promise: null,
};
globalThis.mongooseCache = cached;

async function dbConnect(): Promise<Mongoose> {
    /* 1. Return the existing connection immediately if it's alive */
    if (cached.conn) {
        return cached.conn;
    }

    /* 2. Guard: ensure the env var exists at call-time, not import-time,
          so Next.js builds don't crash when the var isn't set yet. */
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        throw new Error(
            'Please define the MONGODB_URI environment variable inside .env.local'
        );
    }

    /* 3. Create a single connection promise (deduplicated) */
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
            maxPoolSize: 10,          // cap the pool to prevent connection storms
        });
    }

    /* 4. Await the shared promise; reset on failure so the next caller retries */
    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null;
        throw err;
    }

    return cached.conn;
}

export default dbConnect;
