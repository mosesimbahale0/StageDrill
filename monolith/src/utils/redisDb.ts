// // src/utils/redisDb.ts
// import { RedisPubSub } from "graphql-redis-subscriptions";
// import { createClient, type RedisClientType } from "redis";

// export const pubsub = new RedisPubSub();

// export let redisClient: RedisClientType;

// export async function initRedis(): Promise<void> {
//   // create and connect client
//   redisClient = createClient({
//     socket: { host: "127.0.0.1", port: 6379 },
//   });

//   redisClient.on("error", (err) => {
//     console.error("Redis Client Error", err);
//   });

//   await redisClient.connect();
//   console.log("🔥🟢🟢🟢🟢🟢🟢 Connected to Redis!");

//   // (optional) sanity check
//   await redisClient.set("key", "value");
//   console.log('✅ ✅✅✅✅✅ Set "key" = "value"');
//   const val = await redisClient.get("key");
//   console.log(`🔍🔍🔍🔍🔍🔍🔍 Retrieved "key" = ${val}`);
// }

// ----------------------------------------------UP STASH -------------------------------------------------
// ONLINE
// ----------------------------------------------UP STASH -------------------------------------------------

// src/utils/redisDb.ts
import colors from "colors";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { createClient, type RedisClientType } from "redis";
import Redis from "ioredis"; // Import ioredis
import dotenv from "dotenv";



colors.enable();
dotenv.config();

// Ensure environment variables are loaded first (e.g., using dotenv)
// require('dotenv').config(); // If you use dotenv, call it at the very top of your app entry point.

// Configuration for node-redis client (redisClient)
// const nodeRedisConfig = {
//   password: process.env.UPSTASH_REDIS_PASSWORD,
//   socket: {
//     host: "gusc1-supreme-sawfish-30434.upstash.io", // Upstash host
//     port: 6379, // node-redis v4 prefers a number here
//     tls: true, // Required for Upstash
//     rejectUnauthorized: true, // Temporary for testing
//   },
// };

// redis-cli --tls -u redis://default:4221e8ab8e0a4c2a89a0af319f51390b@gusc1-supreme-sawfish-30434.upstash.io:30434


const nodeRedisConfig = {
  password: process.env.UPSTASH_REDIS_PASSWORD,
  socket: {
    host: "civil-rodent-10280.upstash.io", // Upstash host
    port: 6379, // Correct port for Upstash
    tls: true, // Required for Upstash
    rejectUnauthorized: true, // Temporary for testing
  },
};


// Configuration for ioredis clients (used by RedisPubSub)
const ioredisConfig = {
  host: nodeRedisConfig.socket.host,
  port:
    typeof nodeRedisConfig.socket.port === "string"
      ? parseInt(nodeRedisConfig.socket.port, 10)
      : nodeRedisConfig.socket.port,
  username: "default", // <- REQUIRED for Upstash
  password: nodeRedisConfig.password,
  tls: {}, // TLS config for Upstash
  retryStrategy: (times: number) => Math.min(times * 100, 3000),
  maxRetriesPerRequest: null,
};

export let redisClient: RedisClientType;

// --- Initialize RedisPubSub with ioredis clients ---
// It's better to create publisher and subscriber clients explicitly to manage them and their errors.
const publisher = new Redis(ioredisConfig);
const subscriber = new Redis(ioredisConfig);

publisher.on("connect", () => {
  console.log(colors.yellow("🔶 ioredis Publisher connected to Upstash."));
});
publisher.on("error", (err) => {
  console.error(colors.red.bold("❌ ioredis Publisher Error:"), err);
  // This will catch NOAUTH if password is wrong for publisher, or other connection errors.
});

subscriber.on("connect", () => {
  console.log(colors.yellow("🔷 ioredis Subscriber connected to Upstash."));
});
subscriber.on("error", (err) => {
  console.error(colors.red.bold("❌ ioredis Subscriber Error:"), err);
  // This will catch NOAUTH if password is wrong for subscriber, or other connection errors.
});

export const pubsub = new RedisPubSub({
  publisher,
  subscriber,
});

export async function initRedis(): Promise<void> {
  try {
    // Initialize main Redis client (node-redis)
    redisClient = createClient({
      ...nodeRedisConfig, // Use the correctly scoped config
    });

    redisClient.on("error", (err) => {
      console.error(colors.red("🛑 node-redis Client Error:"), err);
    });

    await redisClient.connect();
    console.log(
      colors.bgMagenta.bold(
        "🔥 Connected to Upstash Redis (node-redis client)!"
      )
    );

    // Sanity check with better error handling
    const testKey = "upstash_test_key";
    const testValue = "test_value_works";

    await redisClient.set(testKey, testValue);
    console.log(
      colors.green(`✅ Set "${testKey}" = "${testValue}" (node-redis)`)
    );

    const retrievedValue = await redisClient.get(testKey);
    if (retrievedValue === testValue) {
      console.log(
        colors.cyan(
          `🔍 Retrieved "${testKey}" = "${retrievedValue}" (node-redis)`
        )
      );
    } else {
      console.error(
        colors.red(
          "🔴 Value mismatch - Connection verification failed (node-redis)"
        )
      );
      throw new Error("Redis connection verification failed (node-redis)");
    }
  } catch (error) {
    console.error(
      colors.red.bold("❌ Error in initRedis (node-redis setup):"),
      error
    );
    // If pubsub errors are now caught by their own handlers,
    // any error caught here is more likely from the node-redis client operations above.
    process.exit(1); // Exit with error code
  }
}

// Optional: Connection tester (can be used separately)
export async function testRedisConnection(): Promise<void> {
  try {
    // Use the node-redis config for this test client
    const tempClient = createClient(nodeRedisConfig);
    await tempClient.connect();
    console.log(
      colors.bgGreen(
        "✅ Temporary connection successful (node-redis to Upstash)!"
      )
    );
    await tempClient.disconnect();
  } catch (error) {
    console.error(
      colors.red("❌ Temporary connection failed (node-redis to Upstash):"),
      error
    );
    throw error; // Rethrow to indicate failure to caller
  }
}
