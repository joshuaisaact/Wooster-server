import app from './index';
import { logger } from './utils/logger';

const config = {
  port: process.env.PORT || 4000,
  environment: process.env.NODE_ENV || 'development',
};

logger.info('Starting server with configuration', config);

const PORT = config.port;

if (!PORT) {
  logger.error('Missing environment variable: PORT');
  throw new Error('Missing environment variable: PORT');
}

app.listen(PORT, () => {
  logger.info({
    message: 'Server started successfully',
    url: `http://localhost:${PORT}`,
    startupTime: new Date().toISOString(),
  });
});
