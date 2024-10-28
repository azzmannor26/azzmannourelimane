import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email', // Use the provided Ethereal host
      port: 587, // Use the provided Ethereal port
      secure: false, // Use STARTTLS (not SSL/TLS) for encryption
      auth: {
        user: 'natalia1@ethereal.email', // Replace with your Ethereal user
        pass: '5f5DPFDxCyBvn4cEwx', // Replace with your Ethereal password
      },
      tls: {
        ciphers: 'SSLv3', // Enforce stronger encryption (optional)
      },
    });
  }

  async sendPasswordResetEmail(to: string, resetToken: string) {
    // Generate the reset link using the actual token string (resetToken)
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: '"Your App" <natalia1@ethereal.email>', // Replace with your Ethereal sender email
      to: to, // Recipient's email
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <p><a href="${resetLink}">Reset Password</a></p>`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); // Use this URL to view the email on Ethereal
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
