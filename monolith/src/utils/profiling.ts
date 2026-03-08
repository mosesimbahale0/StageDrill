import colors from "colors";
import { Request, Response, NextFunction } from "express";

/**
 * Logs the current memory usage of the Node.js process.
 */
export function logMemory() {
  process.on("warning", (e) => console.warn(e.stack));
  const used = process.memoryUsage();
  console.log(`Memory Usage:
    RSS: ${(used.rss / 1024 / 1024).toFixed(2)} MB
    Heap Total: ${(used.heapTotal / 1024 / 1024).toFixed(2)} MB
    Heap Used: ${(used.heapUsed / 1024 / 1024).toFixed(2)} MB
    External: ${(used.external / 1024 / 1024).toFixed(2)} MB`);
}

/**
 * Express middleware that logs the time taken for a request to complete.
 * Uses high-resolution time from process.hrtime.
 */
export function requestTimer(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const end = process.hrtime.bigint();
    // Calculate duration in nanoseconds and convert to milliseconds
    const durationInMs = Number(end - start) / 1_000_000;

    // Log performance with status code, method, URL, and time
    console.log(
      colors.magenta(
        `[PERF] ${res.statusCode} ${req.method} ${
          req.originalUrl
        } - ${durationInMs.toFixed(2)} ms`
      )
    );
  });

  next();
}
