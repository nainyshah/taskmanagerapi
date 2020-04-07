// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const sendWelcomeEmail = (email, name) => {
//   sgMail.send({
//     to: email,
//     from: "syed.raza@iswiftful.com",
//     subject: "Testing SendGrid",
//     text: "Welcome to the app. ${name}. Let me know how you get along."
//   });
// };

// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const msg = {
//   to: "test@example.com",
//   from: "test@example.com",
//   subject: "Sending with Twilio SendGrid is Fun",
//   text: "and easy to do anywhere, even with Node.js",
//   html: "<strong>and easy to do anywhere, even with Node.js</strong>"
// };
// sgMail.send(msg);

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//ES6

const sendWelcomeEmail = (email, name) => {
  const msg = {
    to: email,
    from: "syed.raza@iswiftful.com",
    subject: "Testing SendGrid",
    text: "Welcome to the app Mr. " + name + ". Let me know how you get along."
  };
  console.log(msg);
  sgMail.send(msg).then(
    () => {
      console.log("Email sent!");
    },
    error => {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  );
};

const sendCancellationEmail = (email, name) => {
  const msg = {
    to: email,
    from: "syed.raza@iswiftful.com",
    subject: "Request for deleting Account",
    html:
      "<b>Hello Mr. " +
      name +
      ",</b> <br><br> We are confirming that your account has been closed and can no longer be used.<br><br><br> Regards, <br><br> i5sigma Team."
  };
  console.log(msg);
  sgMail.send(msg).then(
    () => {
      console.log("Email sent!");
    },
    error => {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  );
};

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
};
//ES8
// (async () => {
//   try {
//     await sgMail.send(msg);
//   } catch (error) {
//     console.error(error);

//     if (error.response) {
//       console.error(error.response.body);
//     }
//   }
// })();
