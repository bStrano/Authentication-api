import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, context, trace }) => {
  return `${timestamp} [${context || 'Application'}] ${level}: ${message}${
    trace ? `\n${trace}` : ''
  }`;
});

export const winstonConfig: WinstonModuleOptions = {
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        logFormat,
      ),
    }),
    // File transport for errors
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        winston.format.json(),
      ),
    }),
    // File transport for all logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json(),
      ),
    }),
  ],
};
