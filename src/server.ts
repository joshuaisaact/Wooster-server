import app from './index';

const PORT = process.env.PORT || 4000;

if (!PORT) {
  throw new Error('Missing environment variable: PORT');
}

app.listen(PORT, () => {
  const timestamp = new Date().toLocaleString();
  const host = `http://localhost:${PORT}`;
  console.log(`
    ----------------------------------------
    🚀 Server is running successfully!
    🌐 URL: ${host}
    📅 Startup Time: ${timestamp}
    ----------------------------------------
    `);
});
