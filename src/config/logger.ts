import winston from 'winston';

class Logger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: 'ravenpay' },
      transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
      ]
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new winston.transports.Console({
        format: winston.format.simple()
      }));
    }
  }

  public info(message: string, meta: any = {}): void {
    this.logger.info(message, meta);
  }

  public error(message: string, meta: any = {}): void {
    this.logger.error(message, meta);
  }

  public warn(message: string, meta: any = {}): void {
    this.logger.warn(message, meta);
  }

  public debug(message: string, meta: any = {}): void {
    this.logger.debug(message, meta);
  }
}

export default new Logger();