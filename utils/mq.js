import { Queue, Worker } from "bullmq";

export const emailQueue = new Queue("emailQueue");
export const timedQueue = new Queue("timedQueue");

