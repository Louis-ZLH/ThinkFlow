import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { Resend } from 'resend';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
export async function sendVerificationEmail(to, code) {

    const data = await resend.emails.send({
      from: 'ThinkFlow <onboarding@resend.dev>', // ✅ 建议先用这个测试发件人
      to,
      subject: 'Your ThinkFlow Verification Code',
      html: `<h2>Your verification code is: <strong>${code}</strong></h2>`,
    });
    console.log('Email sent with Resend:', {data});
    if(data.error)
    {
        return false;
    }
    else{
        return true;
    }

}