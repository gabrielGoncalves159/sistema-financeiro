import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const start = Date.now();
    res.on('finish', () => {
      const { statusCode } = res;
      const end = Date.now();
      const delay = end - start;
      this.logger.log(`${method} ${originalUrl} ${statusCode} - ${delay}ms`);
    });

    next();
  }
}
