import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import {REDIS_PORT, REDIS_HOST, REDIS_PASSWORD} from '../env';
import express from 'express';
import throng from 'throng';

var WORKERS = process.env.WEB_CONCURRENCY || 4;

function worker() {
  console.log(`Worker started at ${process.pid}`)
  const app = express();
  const redis_connection: IORedis.Redis = new IORedis(REDIS_HOST, {
    password: REDIS_PASSWORD,
    port: REDIS_PORT as unknown as number
  });

  app.post('/add_job', (req: express.Request, res: express.Response) => {
    const queue = new Queue('hi', {connection: redis_connection});
    queue.add('statistics', req.body)
  });
  

  app.listen(process.env.PORT);
}

function master() {
  console.log(`Master started at ${process.pid}`)

  process.on('beforeExit', () => {
    console.log('Master cleanup.')
  })
}

throng({
  worker: worker,
  master: master,
  count: WORKERS as number,
  lifetime: Infinity
});

