// src/utils/logger.ts
import morgan from 'morgan';
import colors from 'colors';
import { Request, Response, NextFunction } from 'express';

// Define custom morgan tokens
morgan.token('request-headers', (req: Request) => JSON.stringify(req.headers));
morgan.token('request-body', (req: Request) => JSON.stringify(req.body));

// Configure morgan middleware
export const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms'
);

// Middleware to log authorization headers
export const authLogMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(colors.bgRed(`Authorization Header: ${req.headers.authorization}`));
  console.log(colors.bgRed(`Auth Present: ${!!req.headers.authorization}`));
  next();
};

// Middleware to log request method
export const methodLogMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(colors.bgGreen(`Request Method: ${req.method}`));
  next();
};

// Middleware to log response code
export const responseLogMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.on('finish', () => {
    console.log(colors.bgBlue(`Response Code: ${res.statusCode}`));
  });
  next();
};