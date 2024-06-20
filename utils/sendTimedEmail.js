import dotenv from "dotenv";
import { emailQueue,timedQueue } from "./mq.js";
dotenv.config();
const sendTimedEmail = async (options) => {
  // var transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  //   port: process.env.SMTP_PORT,
  //   auth: {
  //     user: process.env.SMTP_EMAIL,
  //     pass: process.env.SMTP_PASSWORD,
  //   },
  // });
  // const transporter = nodemailer.createTransport(
  //   nodemailerSendgrid({
  //     apiKey: process.env.SENDGRID_PASSWORD,
  //   }),
  // );
  const message = {
    to: options.email,
  };

  return await timedQueue.add("send-email", message);
};

export default sendTimedEmail;
