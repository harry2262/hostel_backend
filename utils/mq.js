import { Queue, Worker } from "bullmq";

export const emailQueue = new Queue("emailQueue",{
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT, 
	password: process.env.REDIS_PASSWORD,
},
});
export const timedQueue = new Queue("timedQueue",{
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
	password: process.env.REDIS_PASSWORD,
  },
});

