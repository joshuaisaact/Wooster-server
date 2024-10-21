import express from 'express';
import cors from 'cors';
import routes from './routes/routes';
import 'dotenv/config';

const app = express();

const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

if (!PORT) {
  throw new Error('Missing environment variable: PORT');
}

console.log('Supabase URL:', process.env.SUPABASE_URL);
console.log('Allowed CORS Origin:', CLIENT_URL);

app.use(express.json());

app.use(
  cors({
    origin: CLIENT_URL,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    credentials: true,
  }),
);

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
