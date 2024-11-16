import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes/routes';
import { errorHandler } from './middleware/error-handler';
import { generalLimiter } from './middleware/rate-limits';
import 'dotenv/config';
import { logger } from './utils/logger';

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

logger.info('Supabase URL:', process.env.SUPABASE_URL);
logger.info('Allowed CORS Origin:', CLIENT_URL);

app.use(generalLimiter);

app.use(express.json({ limit: '1mb' }));

const isDevelopment = process.env.NODE_ENV !== 'production';
const allowedOrigins = isDevelopment
  ? ['http://localhost:5173']
  : [
      'http://46.101.72.66',
      'https://trywooster.live',
      'https://www.trywooster.live',
    ];

logger.info('Allowed CORS Origins:', allowedOrigins);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    credentials: true,
  }),
);

app.get('/', (_: Request, res: Response) => {
  res.status(200).send('Welcome to the server!');
});

app.use((req: Request, _: Response, next) => {
  logger.info(`🔥 ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api', routes);

app.use((_, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use(errorHandler);

export default app;
