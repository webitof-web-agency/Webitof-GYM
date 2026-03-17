import dotenv from 'dotenv';
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? './.env.production' : './.env',
});

import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { Server } from 'http';

import express from 'express';
import mongoose from 'mongoose';
import apiRoutes from './routes/api';
import { decodeToken } from './middlewares/auth.middleware';
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import logger from './utils/logger';
import { socket } from './utils/socket';

const PORT = process.env.PORT || 8080;
const app = express();
const isDatabaseReady = () => mongoose.connection.readyState === 1;

app.use(compression());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(cors());

const isEnvExist = fs.existsSync('./.env');

if (isEnvExist === false) {
  const { createAdminAndEnv } = require('./controllers/admin.controller');

  app.get('/', (req, res, next) => {
    return res.status(200).json({
      status: true,
      env: false,
    });
  });

  app.post('/setting', createAdminAndEnv);

  // server listening
  app.listen(PORT, () => console.log(`Server is listening on port : ${PORT}`));
} else {
  mongoose.set('bufferCommands', false);

  const server = new Server(app);

  const { notify, io } = socket(server);

  app.use(
    fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  );

  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //* will allow from all cross domain
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS',
    );
    res.locals.notify = notify;
    res.locals.io = io;
    next();
  });

  const morganFormat = ':method :url :status :response-time ms';

  // morgan routes view
  if (process.env.NODE_ENV === 'development') {
    app.use(
      morgan(morganFormat, {
        stream: {
          write: (message) => {
            const logObject = {
              method: message.split(' ')[0],
              url: message.split(' ')[1],
              status: message.split(' ')[2],
              responseTime: message.split(' ')[3],
            };
            logger.info(JSON.stringify(logObject));
          },
        },
      }),
    );
    console.log('Morgan connected..');
  }

  app.use((req, res, next) => {
    if (!isDatabaseReady()) {
      return res.status(503).send({
        error: true,
        msg: 'Database is not connected. Please check MongoDB and try again.',
      });
    }
    next();
  });

  app.use(decodeToken);
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  app.use('/api', apiRoutes);
  app.get('*', (req, res) => {
    res.send('Welcome to Gymstick!');
  });
  const cron = require('node-cron');
  const { cornEmail } = require('./utils/marketing/emailCron');

  //run every 5 minutes
  cron.schedule('*/5 * * * *', () => {
    cornEmail();
  });

  const startServer = async () => {
    try {
      await mongoose.connect(process.env.DATABASE_URL, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('MongoDB Connected Successfully.');

      server.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
      });
    } catch (err) {
      console.log('Database connection failed.', err);
      process.exit(1);
    }
  };

  mongoose.connection.on('disconnected', () => {
    logger.error('MongoDB disconnected.');
  });

  mongoose.connection.on('error', (error) => {
    logger.error(`MongoDB error: ${error?.message || error}`);
  });

  startServer();
}
