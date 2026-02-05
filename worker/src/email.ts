import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_ENDPOINT,
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmail(to: string, body: string){
//send out the user email
  await transporter.sendMail({
    from: "onboarding@resend.dev",
    sender: "onboarding@resend.dev",
    to,
    subject: "Hello from Zapier",
    text: body,
  })
}