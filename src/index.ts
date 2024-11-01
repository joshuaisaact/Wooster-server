import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes/routes';
import { errorHandler } from './middleware/error-handler';
import { generalLimiter } from './middleware/rate-limits';
import 'dotenv/config';

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

console.log('Supabase URL:', process.env.SUPABASE_URL);
console.log('Allowed CORS Origin:', CLIENT_URL);

app.use(generalLimiter);

app.use(express.json({ limit: '1mb' }));

app.use(
  cors({
    origin: CLIENT_URL,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    credentials: true,
  }),
);

app.get('/', (_: Request, res: Response) => {
  res.status(200).send('Welcome to the server!');
});

app.use(routes);

app.use((_, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use(errorHandler);

export default app;
