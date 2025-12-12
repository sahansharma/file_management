import { Request, Response, NextFunction } from "express";

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

const DEFAULT_WINDOW = 60_000; // 1 minute
const DEFAULT_LIMIT = 100;

export const rateLimit = (maxRequests = DEFAULT_LIMIT, windowMs = DEFAULT_WINDOW) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || (req.headers["x-forwarded-for"] as string) || "unknown";
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || entry.resetAt <= now) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (entry.count >= maxRequests) {
      res.setHeader("Retry-After", String(Math.ceil((entry.resetAt - now) / 1000)));
      return res.status(429).json({ message: "Too many requests" });
    }

    entry.count += 1;
    store.set(key, entry);
    next();
  };
};

// default instance
export const defaultRateLimit = rateLimit();
