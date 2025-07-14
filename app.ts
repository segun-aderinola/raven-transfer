import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Routes } from './src/routes';
import { ErrorMiddleware } from './src/middleware/ErrorMiddleware';
import { RateLimitMiddleware } from './src/middleware/RateLimitMiddleware';
import logger from './src/config/logger';

export class App {
  private app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());
    this.app.use(cors());

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      next();
    });
  }

  private initializeRoutes(): void {
    const routes = new Routes();
    this.app.use('/api/v1', routes.getRouter());

    // Root endpoint
    this.app.get('/', (req: Request, res: Response) => {
      res.json({
        success: true,
        message: 'Raven Pay Test',
        version: '1.0.0',
        endpoints: {
          auth: '/api/auth',
          bankAccounts: '/api/bank-accounts',
          transactions: '/api/transactions',
          webhook: '/api/webhook',
          health: '/api/health'
        }
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(ErrorMiddleware.notFound);

    // Global error handler
    this.app.use(ErrorMiddleware.handle);
  }

  public getApp(): Application {
    return this.app;
  }
}