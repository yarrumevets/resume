# &#128209; Google Docs Resumé Viewer & Downloader

A simple app for displaying and downloading a Google Drive docs in various formats.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Roadmap](#roadmap)
- [Installation](#installation)
- [Tech](#tech)
- [Setup](#setup)
- [Usage](#usage)
- [License](#license)
- [Media Sources](#media-sources)
- [Live Demo](#live-demo)

## Introduction

I started this project as a simple challenge to get my feet wet with some of the features of Google Cloud, while also building something to display and distribute my resumé.

## Tech

- Vanilla JS - This app was initially intended as a very minimalist POC for demonstrating integration with the Google Docs API.
- Node Express - A very simple express server with endpoints for downloading the document in the various file types.
- GoogleAPIs Node.js client - For authenticating and fetching the document in text and binary formats

## Features

- Loads and displays your Google document as HTML
- Provides buttons for downloading your document in various formats, including: PDF, DOCX, RTF, TXT, ZIP, EPUB

## Roadmap

- Currently, there is not much done to parse the data inside the doc. I plan to add updates that allow overriding styles for particular parts, especially for font-sizes, to make the document responsive.

## Installation

Step-by-step instructions on how to get the development environment running.

```bash
git clone https://github.com/yarrumevets/resume.git
cd resume
yarn
```

## Setup

Google Docs:

- Create a resume, or any file that you'd like to display and share.

Google Cloud:

- You must have a Google Cloud platform account and create a new project with the Google Docs API enabled.

Back-end Config:

1. Rename sample-config.json and sample-google.creds.json to config.json and google.creds.json

2. Replace the sample ID in config.json with the ID of your document in Google Docs.

3. Replace the following in google.creds.json with your corresponding credentials in Google Cloud:

```json
{
  "project_id": "project-id-#####",
  "private_key_id": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\nXXXXXXXXXXXXXXXX...XXXXXXXXXXXXXXXXXX\n-----END PRIVATE KEY-----\n",
  "client_email": "your_clien_email@omega-booster-123456.iam.gserviceaccount.com",
  "client_id": "111222333444555666777",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your_project%40omega-booster-xxxxxx.iam.gserviceaccount.com"
}
```

Front-end:

- Replace value of the `PAGE_TITLE` & `FILE_NAME` constant at the top of `main.js` to reflect your own title and file name of the downloaded files.

## Usage

```bash
node server.js
```

Go to `http://localhost:<PORT>` in your browser.

## License

Distributed under the MIT License. See the LICENSE file for more information.

## Media Sources

Google official icons: https://about.google/brand-resource-center/logos-list/

## Live Demo

&#128073; [Live Demo of my resumé](https://yarrumevets.com/resume) &#128072;
