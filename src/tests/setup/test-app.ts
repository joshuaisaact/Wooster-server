import express from 'express';
import routes from '../../routes/routes';
import { errorHandler } from '../../middleware/error-handler';

export const createTestApp = () => {
  const app = express();

  // Essential middleware only
  app.use(express.json());

  // Routes
  app.use('/api', routes);

  // Error handling
  app.use(errorHandler);

  return app;
};
