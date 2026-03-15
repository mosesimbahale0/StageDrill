import Redis from "ioredis";

// Declare a variable to hold the Redis client instance
let redis: Redis | null = null;

// Function to initialize Redis client if not already initialized
function getRedisClient() {
  if (!redis) {
    // Initialize Redis client
    redis = new Redis({
      socket: {
        host: "127.0.0.1", // Localhost for Redis running locally
        port: 6379, // Default Redis port for local instance
      },
    });

    // Connect to Redis only if not already connected or connecting
    if (redis.status !== "connecting" && redis.status !== "connected") {
      redis.connect().catch(console.error);
    }
  }

  return redis;
}

// Export the Redis client instance (initialized only once)
export default getRedisClient();


