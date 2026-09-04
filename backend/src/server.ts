// backend/src/server.ts
import app from './app';
import { PORT } from './config';

const port = Number(PORT) || 5000;

app.listen(port, () => {
  console.log(`🚀 Backend server running on http://localhost:${port}`);
});
