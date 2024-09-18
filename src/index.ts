import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes/routes';
import 'dotenv/config';

const app = express();

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error('Missing environment variable: PORT');
}

app.use(express.json());
app.use(cors());
app.use(routes);

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
