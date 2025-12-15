import { Request, Response, NextFunction } from 'express';

export const logger = (req: Request, res: Response, next: NextFunction) => {
  res.on('finish', () => {
    const status = res.statusCode;
    if (status >= 400) {
      const method = req.method;
      const url = req.originalUrl || req.url;
      console.log(`${method} ${url} - ${status}`);
    }
  });
  
  next();
};

export const requestLogger = logger;
