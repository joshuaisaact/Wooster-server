import 'express-async-errors';
import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes/routes';
import { errorHandler } from './middleware/error-handler';
import { generalLimiter } from './middleware/rate-limits';
import { logger } from './utils/logger';

const app = express();

const isDevelopment = process.env.NODE_ENV !== 'production';
const allowedOrigins = isDevelopment
  ? ['http://localhost:5173']
  : [
      'http://46.101.72.66',
      'https://trywooster.live',
      'https://www.trywooster.live',
    ];

logger.info('Setting up CORS with allowed origins:', allowedOrigins);

// Add more detailed CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      logger.info('Incoming request from origin:', origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn('Blocked request from unauthorized origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);

// Rest of your middleware
app.use(generalLimiter);
app.use(express.json({ limit: '1mb' }));

// Your routes
app.get('/', (_: Request, res: Response) => {
  res.status(200).send('Welcome to the server!');
});

app.use('/api', routes);

// Add explicit OPTIONS handling
app.options('*', cors()); // Enable pre-flight for all routes

app.use((_, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use(errorHandler);

export default app;
