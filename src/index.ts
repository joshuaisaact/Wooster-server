import express, { Request, Response } from 'express';
import 'dotenv/config';

const app = express();

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error('Missing environment variable: PORT');
}

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
