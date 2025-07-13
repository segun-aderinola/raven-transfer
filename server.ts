import dotenv from 'dotenv';
import { App } from './app';
import database from './src/config/database';
import logger from './src/config/logger';
import { Server as HttpServer } from 'http';

dotenv.config();

export class Server {
  private port: number;
  private app: App;
  private server?: HttpServer;

  constructor() {
    this.port = Number(process.env.PORT);
    this.app = new App();
  }

  public async start(): Promise<void> {
    try {
      await database.testConnection();
      logger.info('Database connected successfully');

      this.server = this.app.getApp().listen(this.port, () => {
        logger.info(`Server running on port ${this.port}`);
        console.log(`Server: http://localhost:${this.port}`);
      });

      process.on('SIGTERM', this.shutdown.bind(this));
      process.on('SIGINT', this.shutdown.bind(this));

    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private async shutdown(): Promise<void> {
    logger.info('Shutting down server...');
    
    if (this.server) {
      this.server.close(() => {
        logger.info('Server closed');
        database.closeConnection().then(() => {
          process.exit(0);
        });
      });
    }
  }
}

// Start the server
if (require.main === module) {
  const server = new Server();
  server.start().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}