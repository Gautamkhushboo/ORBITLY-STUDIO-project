// backend/src/server.ts
import app from './app';
import { PORT, connectDatabase } from './config';

const port = Number(PORT) || 5000;

const startServer = async () => {
  // Connect to database
  await connectDatabase();

  app.listen(port, () => {
    console.log(`🚀 Backend server running on http://localhost:${port}`);
  });
};

startServer();

