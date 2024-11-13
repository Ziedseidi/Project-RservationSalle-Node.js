const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "ziedsaydi@gmail.com", 
        pass: "ylaj pnio grek hekb", 
    }
});

const sendMail = (to, object, content, isHtml) => {
    if (isHtml) {
        transporter.sendMail({
            from: "ziedseidi27@gmail.com", 
            to: to, 
            subject: object, 
            html: content 
        }, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log('E-mail envoyé : ' + info.response);
            }
        });
    } else {
        transporter.sendMail({
            from: "ziedseidi27@gmail.com", 
            to: to, 
            subject: object, 
            text: content 
        }, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log('E-mail envoyé : ' + info.response);
            }
        });
    }
};

module.exports = { sendMail };
