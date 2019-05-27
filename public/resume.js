window.onload = () => {
  const resumeContent = document.getElementById("resume-content");
  var xmlhttp = new XMLHttpRequest();
  const printButton = document.getElementById("print-button");
  const emailButton = document.getElementById("email-button");
  printButton.onclick = e => {
    e.preventDefault();
    window.print();
  };
  emailButton.onclick = e => {
    e.preventDefault();
    alert("email!");
  };
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) {
      // XMLHttpRequest.DONE == 4
      if (xmlhttp.status == 200) {
        resumeContent.innerHTML = xmlhttp.responseText;
      } else if (xmlhttp.status == 400) {
        alert("There was an error 400");
      } else {
        alert("something else other than 200 was returned");
      }
    }
  };
  xmlhttp.open("GET", "/resume/html", true);
  xmlhttp.send();
};
