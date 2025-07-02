const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user : process.env.GMAIL_ID,
        pass : process.env.GMAIL_APP_PASSWORD
    }
});

const send = async (to, subject, body) => {
    const emailOptions = {
        to: to,
        subject: subject,
        text: body,
        from: process.env.GMAIL_ID
    };

    try {
        await transporter.sendMail(emailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Email sending failed');
    }
};

module.exports = {
    send
};

