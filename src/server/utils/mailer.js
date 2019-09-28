import { createTestAccount, createTransport } from 'nodemailer';

const transporter = createTransport({
  host: 'smtp.googlemail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD
  }
});

const sendAccountRecoveryEmail = (user) => {
  createTestAccount(() => {
    const mailOptions = {
      from: `"MyHealthApp" <${process.env.GMAIL_USERNAME}>`,
      to: user.mail, // Recepient email address. Multiple emails can send separated by commas
      subject: 'Recupere su cuenta de MyHealthApp',
      text: `Ingrese el siguiente token dentro de la aplicación para recuperar su contraseña.\n ${user.token}\nEl equipo de MyHealthApp`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return new Error('Error sending email');
      }
    });
  });
};

export default sendAccountRecoveryEmail;
