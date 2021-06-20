var nodemailer = require("nodemailer");


var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

var methods = {

    sendConfirmationMail: async function (
    email,
    username,
  ) {
    let mailOptions = {
      from: "developervs2311@gmail.com",
      to: email,
      subject: `${username}'s Interview Scehduled`,
      html: `<p>Hi ${username}<p>
			<p>Congratulations!!</p>
			<p>Your Interview Has  been Scheduled</p>
			`,
    };
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email send success for - "+email);
      }
    });
  },

};

exports.data = methods;
