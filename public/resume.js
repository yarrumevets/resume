window.onload = () => {
  const resumeContent = document.getElementById("resume-content");
  var xmlhttp = new XMLHttpRequest();
  const printButton = document.getElementById("print-button");
  const emailButton = document.getElementById("email-button");
  const emailForm = document.getElementById("email-form");
  const emailAddressInput = document.getElementById("email-address");
  const sendEmailButton = document.getElementById("send-email-button");
  emailForm.style.display = "none";
  printButton.onclick = e => {
    e.preventDefault();
    window.print();
  };

  toggleEmailForm = e => {
    e.preventDefault();
    emailForm.style.display === "none"
      ? (emailForm.style.display = "block")
      : (emailForm.style.display = "none");
  };
  emailButton.onclick = toggleEmailForm;

  const apiGetCall = (url, callback) => {
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
        // XMLHttpRequest.DONE == 4
        if (xmlhttp.status == 200) {
          callback(xmlhttp.responseText);
        } else if (xmlhttp.status == 400) {
          alert("There was an error 400");
        } else {
          alert("something else other than 200 was returned");
        }
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  };

  sendEmail = e => {
    e.preventDefault();
    const emailaddress = emailAddressInput.value;
    console.log("emailaddress: ", emailaddress);
    apiGetCall(
      `/resume/sendemail?emailaddress=${emailaddress}`,
      responseText => {
        console.log("Ok! res: ", responseText);
      }
    );
  };
  sendEmailButton.onclick = sendEmail;

  apiGetCall("/resume/html", responseText => {
    resumeContent.innerHTML = responseText;
    // Deal with notes.
    // // const notes = [];
    // const footerNotes = document.getElementById("footer-notes");
    // document.querySelectorAll('a[id^="cmnt"]').forEach(a => {
    //   console.log("a: ", a);
    //   a.id.indexOf("_") == -1 ? footerNotes.appendChild(a) : null;
    // });
  });
};
