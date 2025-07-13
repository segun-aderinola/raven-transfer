import rateLimit from 'express-rate-limit';

export class RateLimitMiddleware {
  public static createLimiter(windowMs: number = 15 * 60 * 1000, max: number = 100) {
    return rateLimit({
      windowMs,
      max,
      message: {
        success: false,
        message: 'Too many requests, please try again later.',
        error: 'Rate limit exceeded'
      }
    });
  }

  public static auth() {
    return this.createLimiter(15 * 60 * 1000, 5); // 5 requests per 15 minutes
  }

  public static api() {
    return this.createLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes
  }

  public static webhook() {
    return this.createLimiter(60 * 1000, 100); // 100 requests per minute
  }
}