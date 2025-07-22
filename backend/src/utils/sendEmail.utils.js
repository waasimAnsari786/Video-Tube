import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // or "hotmail", "yahoo", or use custom SMTP
  auth: {
    user: process.env.MAIL_USER, // your email
    pass: process.env.MAIL_PASS, // app password or real password
  },
});

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"Your Brand Name" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
