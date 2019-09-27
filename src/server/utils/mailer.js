import { createTestAccount, createTransport } from 'nodemailer';

const sendEmail = () => {
  createTestAccount((err, account) => {
    const transporter = createTransport({
      host: 'smtp.googlemail.com', // Gmail Host
      port: 465, // Port
      secure: true, // this is true as port is 465
      auth: {
        user: process.env.GMAIL_USERNAME, // Gmail username
        pass: process.env.GMAIL_PASSWORD // Gmail password
      }
    });

    const mailOptions = {
      from: `"MyHealthApp" <${process.env.GMAIL_USERNAME}>`,
      to: 'mastanca14@gmail.com', // Recepient email address. Multiple emails can send separated by commas
      subject: 'Recover your MyHealthApp password',
      text: 'This is the email sent through Gmail SMTP Server.'
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    });
  });
};

export default sendEmail;
