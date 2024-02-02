const express = require('express');
const { google } = require('googleapis');
// const { parse } = require('node-html-parser');

const app = express();
const port = 3334;

const SCOPES = ['https://www.googleapis.com/auth/documents.readonly'];

// Use the content of your service account key JSON file
const serviceAccountKey = require('../google.secret.json'); // Update the path accordingly

const oAuth2Client = new google.auth.JWT(
  serviceAccountKey.client_email,
  null,
  serviceAccountKey.private_key,
  SCOPES
);

async function getGoogleDocContent() {
  const docs = google.docs({ version: 'v1', auth: oAuth2Client });

  // Doc URL: https://docs.google.com/document/d/1SHR8qJS1WD-WRUdDL8ziegQ_M_DLwmFx1Ps6I847Rc4/edit

  try {
    const res = await docs.documents.get({
      documentId: '1SHR8qJS1WD-WRUdDL8ziegQ_M_DLwmFx1Ps6I847Rc4',
    });

    const document = res.data.body.content;
    const htmlContent = parseDocumentToHtml(document);

    return htmlContent;
  } catch (error) {
    console.error('Error retrieving Google Doc content:', error);
    return null;
  }
}

function parseDocumentToHtml(document) {
  let htmlContent = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>';

  document.forEach((element) => {
    if (element.paragraph) {
      element.paragraph.elements.forEach((el) => {
        if (el.textRun) {
          htmlContent += `<p>${el.textRun.content}</p>`;
        }
      });
    }
  });

  htmlContent += '</body></html>';
  return htmlContent;
}

app.get('/', async (req, res) => {
  const htmlContent = await getGoogleDocContent();
  if (htmlContent) {
    res.send(htmlContent);
  } else {
    res.status(500).send('Error retrieving Google Doc content');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});