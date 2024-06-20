import dotenv from "dotenv";
import sendgrid from "@sendgrid/mail";

dotenv.config();


sendgrid.setApiKey(process.env.SMTP_PASSWORD);
const sendEmailAsync = async (options) => {
  const message = {
    from: "jashanbath608@gmail.com ",
    to: options.email,
    subject: options.subject,
    html: options.message,
  };
  const res = await sendgrid.send(message);
  console.log(res);
};
export default sendEmailAsync;
