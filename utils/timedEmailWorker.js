import sendgrid from "@sendgrid/mail";
import { Worker } from "bullmq";

sendgrid.setApiKey(process.env.SMTP_PASSWORD);


const emailhandler = async (job) => {
  console.log(`processing job with id ${job.id}`);
  const to = job.data.to;
  const message = {
    from: "jashanbath608@gmail.com ",
    to: to,
    subject: "room allocation time",
    html: "<h1>room allocation time</h1>",
  };

  const res = await sendgrid.send(message);
};
const worker = new Worker("timedQueue", emailhandler, {
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

worker.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed with result: ${JSON.stringify(result)}`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job.id} failed with error: ${err.message}`);
});
