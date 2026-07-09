import nodemailer from "nodemailer";
import { config } from "../config/env.js";

const transporter= nodemailer.createTransport({
    service:'gmail',
    port: 587,
    secure: false,
    auth:{
        user: config.email,
        pass: config.emailPassword
    }
})
export const sendEmail=async (to,subject,html)=>{
    try{

        await transporter.sendMail({
            from: config.email,
            to:to,
            subject:subject,
            html:html
        })
    }catch(err){
console.error(" error mail ",err.message);
throw new Error("failed to send mail");
    }
}
export const verificationEmailTemplate= async ( email, token)=>{
    const link = `http://localhost:5000/api/auth/verify/${token}`;

const html=`
<h1> welcome </h1>
<p> click the link below to verify your account </p>
<a href="${link}">Verify Email</a>
<p> this link will expire in 1 hour </p>
`;

await sendEmail(email,"verify your email",html);
}
