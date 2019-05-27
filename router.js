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
    // console.log("dd.data: ", dd.data);
    res.send(dd.data);
  });
});

router.get("/text", (req, res) => {
  const docData = googleapi.getGoogleDocs("text/plain");
  docData.then(dd => {
    // console.log("dd.data: ", dd.data);
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

// Serve the index.html page that wraps the resume or links to other file types.
router.use("/", express.static(__dirname + "/public"));

module.exports = router;
