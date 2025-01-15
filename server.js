const express = require("express");
const { google } = require("googleapis");

const app = express();
const port = 3334;

const SCOPES = ["https://www.googleapis.com/auth/drive.readonly"];

// ! Make sure these files are in your .gitignore.
// The google.creds.json can be created by going to console.cloud.google.com/iam-admin/serviceaccounts
// - select or create a Service Account , go to Keys , then ADD KEY, and download the config file and
// rename to google.creds.json.
const serviceAccountCreds = require("./google.creds.json");
// Google doc ID - Can be found in the file's URL.
const config = require("./config.json");

const docId = config.googleDocId;

const auth = new google.auth.JWT(
  serviceAccountCreds.client_email,
  null,
  serviceAccountCreds.private_key,
  SCOPES
);

const drive = google.drive({ version: "v3", auth });

async function exportGoogleDoc(docId, mimeType) {
  try {
    const response = await drive.files.export(
      {
        fileId: docId,
        mimeType: mimeType,
      },
      { responseType: "stream" }
    );

    return response.data;
  } catch (error) {
    console.error("Error exporting Google Doc:", error);
    return null;
  }
}

async function exportGoogleDocTextFormat(docId, mimeType) {
  try {
    const response = await drive.files.export({
      fileId: docId,
      mimeType: mimeType,
    });

    return response.data;
  } catch (error) {
    console.error("Error exporting Google Doc:", error);
    return null;
  }
}

const fetchGoogleDocText = async (fileType, mimeType, res) => {
  const exportedContent = await exportGoogleDocTextFormat(docId, mimeType);
  if (exportedContent) {
    res.send(exportedContent);
  } else {
    res.status(500).send(`Error exporting Google Doc (${fileType})`);
  }
};

const fetchGoogleDoc = async (fileType, mimeType, res) => {
  try {
    const exportedContent = await exportGoogleDoc(docId, mimeType);
    if (!exportedContent) {
      throw new Error("Exported content is missing or undefined.");
    }
    const filename = `exported-document.${fileType}`;
    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    exportedContent.pipe(res);
  } catch (error) {
    console.error("Error fetchGoogleDoc: ", error);
    res.status(500).send(`Error exporting Google Doc (${fileType}):`);
  }
};

// Google Drive MIME Types:
// https://developers.google.com/drive/api/guides/ref-export-formats

// HTML
app.get("/html", async (req, res) => {
  fetchGoogleDocText("html", "text/html", res);
});

// TXT
app.get("/txt", async (req, res) => {
  fetchGoogleDocText("txt", "text/plain", res);
});

// PDF
app.get("/pdf", async (req, res) => {
  const mimeType = "application/pdf";
  const fileType = "pdf";
  fetchGoogleDoc(fileType, mimeType, res);
});

// DOCX
app.get("/docx", async (req, res) => {
  const mimeType =
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  const fileType = "docx";
  fetchGoogleDoc(fileType, mimeType, res);
});

// RTF
app.get("/rtf", async (req, res) => {
  const mimeType = "application/rtf";
  const fileType = "rtf";
  fetchGoogleDoc(fileType, mimeType, res);
});

// ZIP
app.get("/zip", async (req, res) => {
  const mimeType = "application/zip";
  const fileType = "zip";
  fetchGoogleDoc(fileType, mimeType, res);
});

// EPUB
app.get("/epub", async (req, res) => {
  const mimeType = "application/epub+zip";
  const fileType = "epub";
  fetchGoogleDoc(fileType, mimeType, res);
});

// Static public files.
app.use("/", express.static(__dirname + "/public"));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
