const nodemailer = require('nodemailer');
const pug = require('pug');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Oleg Smushkevich <${process.env.EMAIL_FROM}>`;
  }
  createTransport() {
    if (process.env.NODE_ENV === 'production') {
      //Sendgrid
      return 1;
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  //Send actual email
  send(template, subject) {
    // 1)Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`);

    // 2) Define email options
    const mailOptions = {
      from: 'Oleg Smushkevich <olegs7771@gmail.com>',
      to: options.email,
      subject: options.subject,
      text: options.message,
      //html
    };
    // 3) Create a transport and sand email
  }

  sendWelcome() {
    this.send('welcome', 'Welcome to Natours family!');
  }
};

const sendEmail = async (options) => {
  //2)Define the email options
  const mailOptions = {
    from: 'Oleg Smushkevich <olegs7771@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html
  };
  // Send mail
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
