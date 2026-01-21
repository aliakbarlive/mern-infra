import mongoose from 'mongoose';
import { app } from './app';
import { env } from './config/env';
import { logger } from './lib/logger';

async function start() {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info('Connected to MongoDB');

    const port = Number(env.PORT) || 4000;
    const server = app.listen(port, () => {
      logger.info({ port }, 'API server listening');
    });

    const shutdown = () => {
      logger.info('Shutting down server');
      server.close(() => {
        mongoose.connection.close(false).then(() => {
          process.exit(0);
        });
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
}

start();
