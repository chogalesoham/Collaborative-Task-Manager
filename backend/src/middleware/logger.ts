import { Request, Response, NextFunction } from 'express';

export const logger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl || req.url;
    const status = res.statusCode;
    
    // Color coding for status
    const statusColor = status >= 500 ? '\x1b[31m' : // Red for 5xx
                       status >= 400 ? '\x1b[33m' : // Yellow for 4xx
                       status >= 300 ? '\x1b[36m' : // Cyan for 3xx
                       '\x1b[32m'; // Green for 2xx
    
    console.log(
      `[${timestamp}] ${method} ${url} ${statusColor}${status}\x1b[0m - ${duration}ms`
    );
  });
  
  next();
};

export const requestLogger = logger;
