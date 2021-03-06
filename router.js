const express = require(`express`);
const router = express.Router();
const moment = require("moment");
const googleapi = require("./googledocsapi");

const isEmpty = obj => {
  return obj && Object.keys(obj).length > 0;
};

// Show visits in console.
router.use((req, res, next) => {
  console.log(
    `Visitor at ${moment().format("YYYY MMMM Do (dddd) @ h:mm:ss a")})`
  );
  next();
});

router.use((req, res, next) => {
  const query = req.query;
  if (query && isEmpty(query)) {
    console.log("Query: ");
    console.dir(query, { depth: null });
  }
  next();
});

router.get("/html", (req, res) => {
  const docData = googleapi.getGoogleDocs("text/html");
  docData.then(dd => {
    res.send(dd.data);
  });
});

router.get("/text", (req, res) => {
  const docData = googleapi.getGoogleDocs("text/plain");
  docData.then(dd => {
    res.send("" + dd.data.toString());
  });
});

router.get("/txt", (req, res) => {
  const docData = googleapi.getGoogleDocs("text/plain");
  docData.then(dd => {
    res.setHeader("Content-type", "text/plain");
    res.setHeader("Content-disposition", "attachment; filename=resume.txt");
    res.send(dd.data);
  });
});

router.get("/rtf", (req, res) => {
  const docData = googleapi.getGoogleDocs("application/rtf");
  docData.then(dd => {
    res.setHeader("Content-Type", "application/rtf");
    res.setHeader("Content-Disposition", "attachment; filename=resume.rtf");
    res.send(dd.data);
  });
});

router.get("/listfiles", (req, res) => {
  const data = googleapi.listFiles();
  data.then(dd => {
    res.send("Files have been listed in the console!");
  });
});

// The following file types are not working.

// router.get("/epub", (req, res) => {
//   const docData = googleapi.getGoogleDocs("application/epub+zip");
//   docData.then(dd => {
//     res.setHeader("Content-Type", "application/epub+zip");
//     res.setHeader("Content-Disposition", "attachment; filename=resume.epub");
//     res.send(dd.data);
//   });
// });

// router.get("/pdf", (req, res) => {
//   const docData = googleapi.getGoogleDocs("application/pdf");
//   docData.then(dd => {
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");
//     res.send(dd.data);
//   });
// });

// router.get("/htmlzip", (req, res) => {
//   const docData = googleapi.getGoogleDocs("application/zip");
//   docData.then(dd => {
//     res.setHeader("Content-Type", "application/zip");
//     res.setHeader(
//       "Content-Disposition",
//       "attachment; filename=resume_html.zip"
//     );
//     res.send(dd.data);
//   });
// });

// router.get("/word", (req, res) => {
//   const docData = googleapi.getGoogleDocs(
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//   );
//   docData.then(dd => {
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//     );
//     res.setHeader("Content-Disposition", "attachment; filename=resume.doc");
//     res.send(dd.data);
//   });
// });

// router.get("/openoffice", (req, res) => {
//   const docData = googleapi.getGoogleDocs(
//     "application/vnd.oasis.opendocument.text"
//   );
//   docData.then(dd => {
//     res.setHeader("Content-Type", "application/vnd.oasis.opendocument.text");
//     res.setHeader("Content-Disposition", "attachment; filename=resume.odt");
//     res.send(dd.data);
//   });
// });

const nodemailer = require("nodemailer");
const secret = require("./secret.gmail.config.js"); //
router.get("/sendemail", (req, res) => {
  const emailAddress = req.query.emailaddress;
  const message = req.query.message;

  const docData = googleapi.getGoogleDocs("text/html");
  docData.then(dd => {
    resumeContent = dd.data;

    // send the email.
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: secret.gmailAccount,
        pass: secret.gmailPassword
      }
    });
    var mailOptions = {
      from: secret.gmailAccount,
      to: emailAddress,
      subject: "Resume | Steve Murray",
      html: `<h3 style="text-align: center;">Steve Murray's Resume</h3><hr style="margin: 50px auto; width: 80%; border: 0; height: 1px; background-color: #ccc;"/>${resumeContent}<hr  style="margin: 50px auto; width: 80%; border: 0; height: 1px; background-color: #ccc;"/><p style="text-align: center;">* This email has been automatically sent because someone submitted a request to forward my resume to you. Thank you for reading!</p><p style="text-align: center;"><a style="color: #000; text-decoration: none;" href="http://www.yarrumevets.com/resume">www.yarrumevets.com/resume</a></p>`
    };

    // Send the reset email.
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
        res.status(500);
        console.log("Error sending reset email: ", error);
        res.send("Error sending reset email.");
        return;
      } else {
        res.status(200);
        res.send(`Email sent to ${emailAddress}`);
      }
    });
  });
});

// Serve the index.html page that wraps the resume or links to other file types.
router.use("/", express.static(__dirname + "/public"));

module.exports = router;
