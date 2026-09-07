import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

const startServer = async () => {
  await connectDB();
  
  const PORT = env.PORT || 5000;
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${env.NODE_ENV} mode`);
  });
};

startServer();