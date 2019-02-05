"use strict";

function fetchIssues() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        displayIssues(xhttp);
      }
  };
  xhttp.open("GET", 'https://js-issue-tracker.herokuapp.com/api/issues');
  xhttp.send();
}

function displayIssues(xhttp) {
  let ul = document.getElementsByClassName('issues-list')[0];
  let warningMsg = document.getElementsByClassName('warning-msg')[0];

  ul.innerHTML = '';
  warningMsg.style.visibility = 'hidden';

  let issues = JSON.parse(xhttp.response);
  if (issues.length === 0) {
    warningMsg.style.visibility = 'visible';
  }
  else {
    issues.forEach((issue, i) => {
      let li = document.createElement('li');
      li.innerHTML += `${i + 1}. ${issue.name} - ${issue.description}  `;
      li.classList.add('issue-list-item');

      let removeBtn = document.createElement('button');
      removeBtn.innerHTML += 'X';
      removeBtn.onclick = () => {
        let result = window.confirm("Did you complete this issue?");
        if (result) {
          removeIssue(issue.id);
        }
      };
      removeBtn.classList.add('remove-btn');

      li.appendChild(removeBtn);

      ul.appendChild(li);
    });
  }
}

function removeIssue(id) {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        fetchIssues();
      }
  };
  xhttp.open("DELETE", `https://js-issue-tracker.herokuapp.com/api/issues/${id}`);
  xhttp.send();
}

function addIssue(name, description) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 201) {
      setButtonContent('inline', 'none');
      document.location.href = "./issues.html";
    }
  };
  xhttp.open("POST", "https://js-issue-tracker.herokuapp.com/api/issues");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({ name, description}));
}

function submitIssueForm(event) {
  event.preventDefault();

  let form = document.forms['addIssueForm'];

  let name = form['issue_name'].value;
  let description = form['issue_description'].value;

  if (isDataValid(name, description)) {
    setButtonContent('none', 'inline');
    addIssue(name, description);
    clearForm(form);
    resetWarnings();
  }
  else {
    updateWarningMessages(name, description);
  }
}

function setButtonContent(textVisibility, loaderVisibility) {
  document.getElementById("btn-text").style.display = textVisibility;
  document.getElementsByClassName('loader')[0].style.display = loaderVisibility;
}

function updateWarningMessages(name, description) {
  document.getElementById('name-warning').style.visibility = name === '' ? 'visible' : 'hidden';
  document.getElementById('description-warning').style.visibility = description === '' ? 'visible' : 'hidden';
}

function isDataValid(name, description) {
  return name !== '' && description !== '';
}

function clearForm(form) {
  form['issue_name'].value = '';
  form['issue_description'].value = '';
}

function resetWarnings() {
  document.getElementById('name-warning').style.visibility = 'hidden';
  document.getElementById('description-warning').style.visibility = 'hidden';
}