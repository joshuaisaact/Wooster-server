import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...(process.env.NODE_ENV === 'development'
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true, // Colorizes the logs
            translateTime: true, // Adds timestamp formatting
          },
        },
      }
    : {}),
});
