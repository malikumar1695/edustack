import Redis from "ioredis";
import { logger } from "@ilm/http-kit";

const url = process.env.REDIS_URL;


const redis = url
    ? new Redis(url, {
        maxRetriesPerRequest: 1,
        connectTimeout: 1_000,
        enableOfflineQueue: false,
    })
    : null;

// Without a listener, ioredis emits connection errors as unhandled 'error'
// events, which take the process down. This is the single most common way to
// turn a cache outage into an outage.
redis?.on("error", (error) => logger.warn({ err: error }, "redis connection error"));


const TTL_JITTER_RATIO = 0.2;

/** Spreads expiry so keys written together don't all expire in the same second. */
const withJitter = (ttlSeconds: number) =>
    Math.round(ttlSeconds * (1 - TTL_JITTER_RATIO + Math.random() * TTL_JITTER_RATIO * 2));


export const cacheGet = async <T>(key: string): Promise<T | null> => {
    if (!redis) return null;

    try {
        const raw = await redis.get(key);
        return raw ? (JSON.parse(raw) as T) : null;
    } catch (error) {
        // Degrade to the database rather than failing the request.
        logger.warn({ err: error, key }, "cache read failed");
        return null;
    }
};


export const cacheSet = async (key: string, value: unknown, ttlSeconds: number): Promise<void> => {
    if (!redis) return;

    try {
        await redis.set(key, JSON.stringify(value), "EX", withJitter(ttlSeconds));
    } catch (error) {
        logger.warn({ err: error, key }, "cache write failed");
    }
};


/**
 * Paginated lists can't be invalidated key by key — one new student invalidates
 * every page, and SCAN+DEL across the keyspace is O(n) and blocks Redis, which
 * is single-threaded for commands. So the version is part of the key: bumping
 * it makes every old key unreachable and they expire on their own.
 */
export const cacheVersion = async (namespace: string): Promise<number> => {
    if (!redis) return 0;

    try {
        return Number(await redis.get(`${namespace}:version`)) || 0;
    } catch (error) {
        logger.warn({ err: error, namespace }, "cache version read failed");
        return 0;
    }
};

export const bumpCacheVersion = async (namespace: string): Promise<void> => {
    if (!redis) return;

    try {
        await redis.incr(`${namespace}:version`);
    } catch (error) {
        logger.warn({ err: error, namespace }, "cache version bump failed");
    }
};