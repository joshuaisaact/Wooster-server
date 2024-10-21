import app from './index';

const PORT = process.env.PORT || 4000;

if (!PORT) {
  throw new Error('Missing environment variable: PORT');
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
