import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import {REDIS_PORT, REDIS_HOST, REDIS_PASSWORD} from '../env';
const redis_connection: IORedis.Redis = new IORedis(REDIS_HOST, {
  password: REDIS_PASSWORD,
  port: REDIS_PORT as unknown as number
});
import throng from 'throng';
var WORKERS = process.env.WEB_CONCURRENCY || 4;

async function worker () {
  console.log(`Worker started at ${process.pid}`)
  new Worker('hi', async (job: Job) => {
    const commandsPipe = job.data;
    await redis_connection.pipeline([
      [commandsPipe[0].command, commandsPipe[0].arguments as string],
      [commandsPipe[1].command, commandsPipe[1].arguments as string],
      [commandsPipe[2].command, commandsPipe[2].arguments as string],
      [commandsPipe[3].command, commandsPipe[3].arguments as string],
      [commandsPipe[4].command, commandsPipe[4].arguments as string],
      [commandsPipe[5].command, commandsPipe[5].arguments as string],
    ]).exec()
  }, {connection: redis_connection});
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

