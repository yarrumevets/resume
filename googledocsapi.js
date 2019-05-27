const googleDocsApi = {};

const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

const config = require("./config.json");

// If modifying these scopes, delete token.json and re-run the server.
const SCOPES = [
  "https://www.googleapis.com/auth/drive.metadata.readonly",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive"
];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

const authFunction = (theFunc, options) => {
  // Load client secrets from a local file.
  return new Promise((resolve, reject) => {
    fs.readFile("credentials.json", (err, content) => {
      if (err) return console.log("Error loading client secret file:", err);
      // Authorize a client with credentials, then call the Google Drive API.
      // authorize(JSON.parse(content), listFiles);
      err
        ? reject(err)
        : resolve(authorize(JSON.parse(content), theFunc, options));
    });
  });
};

googleDocsApi.getGoogleDocs = mimeType => {
  // Different methods for text based formats.
  let getFileMethod;
  if (
    mimeType === "text/html" ||
    mimeType === "text/plain" ||
    mimeType === "application/rtf"
  ) {
    getFileMethod = getTextFile;
  } else {
    getFileMethod = getBinFile;
  }
  return authFunction(getFileMethod, { mimeType });
};

googleDocsApi.listFiles = () => {
  // not using options.
  return authFunction(listFilesOnDrive, {});
};

function getTextFile(auth, options) {
  const { mimeType } = options;
  const drive = google.drive({ version: "v3", auth });
  // console.log("mimeType: ", mimeType);
  return drive.files
    .export({
      fileId: config.resumeFileId,
      mimeType
    })
    .then(fileData => {
      return fileData;
    });
}

getBinFile = fileId => {
  return { foo: "bar" };
  const axios = require("axios");
  axios
    .get("https://www.googleapis.com/drive/v3/files/" + fileId + "/export")
    .then(response => {
      console.log(response.data.url);
      console.log(response.data.explanation);
    })
    .catch(error => {
      console.log(error);
    });
};

function authorize(credentials, callback, mimeType) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  return new Promise((resolve, reject) => {
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      //callback(oAuth2Client);
      err ? reject(err) : resolve(callback(oAuth2Client, mimeType));
    });
  });
}

function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question("Enter the code from that page here: ", code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function listFilesOnDrive(auth) {
  const drive = google.drive({ version: "v3", auth });
  return drive.files.list(
    {
      pageSize: 10,
      fields: "nextPageToken, files(id, name)"
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const files = res.data.files;
      if (files.length) {
        files.map(file => {
          console.log(`File name: ${file.name} ID: ${file.id}`);
        });
      } else {
        console.log("No files found.");
      }
    }
  );
}

module.exports = googleDocsApi;
