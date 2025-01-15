const htmlButton = document.getElementById("html-button");
const pdfButton = document.getElementById("pdf-button");
const docxButton = document.getElementById("docx-button");
const rtfButton = document.getElementById("rtf-button");
const txtButton = document.getElementById("txt-button");
const zipButton = document.getElementById("zip-button");
const epubButton = document.getElementById("epub-button");

const fileName = "Steve Murray Resume";

// Load HTML resume into DOM.
const loadTextFormat = (fileType) => {
  fetch(fileType)
    .then(function (response) {
      if (!response.ok) {
        throw new Error(`Failed to fetch ${fileType} content.`);
      }
      return response.text();
    })
    .then(function (data) {
      document.getElementById("resume-container").innerHTML = data;
    })
    .catch(function (error) {
      console.error(error.message);
    });
};

loadTextFormat("html");

// Download blob
const downloadFile = async (fileType) => {
  try {
    const response = await fetch(fileType); // url matches fileType.
    if (!response.ok) {
      throw new Error(`Failed to fetch ${fileType} content.`);
    }

    const blob = await response.blob();

    // Create a Blob URL and initiate download
    const url = URL.createObjectURL(blob);

    // Create a temporary button and click it to trigger download.
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.${fileType}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error(error.message);
  }
};

// txt download.
txtButton.addEventListener("click", async () => {
  downloadFile("txt");
  // loadTextFormat("txt"); // This could be implemented with some parsing of whitespace.
});

// PDF download.
pdfButton.addEventListener("click", async () => {
  downloadFile("pdf");
});

// Docx download.
docxButton.addEventListener("click", async () => {
  downloadFile("docx");
});

// rtf download.
rtfButton.addEventListener("click", async () => {
  downloadFile("rtf");
});

// Zip download.
zipButton.addEventListener("click", async () => {
  downloadFile("zip");
});

// epub download.
epubButton.addEventListener("click", async () => {
  downloadFile("epub");
});

htmlButton.addEventListener("click", async () => {
  // loadTextFormat("html");
  downloadFile("html");
});
