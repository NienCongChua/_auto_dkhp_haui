document.getElementById("get-class").addEventListener("click", () => {
  let token = document.getElementById("token").value;
  let fid = document.getElementById("fid").value;
  let cookies = document.getElementById("cookies").value;
  if (token && fid) {
      chrome.runtime.sendMessage({ action: "getClass", token, fid, cookie: cookies });
  } else {
      alert("Please enter token, FID, and cookies.");
  }
});

document.getElementById("register").addEventListener("click", () => {
  let token = document.getElementById("token").value;
  let classId = document.getElementById("class-id").value;
  let cookies = document.getElementById("cookies").value;
  if (token && classId) {
      chrome.runtime.sendMessage({ action: "registerClass", token, classId, cookie: cookies });
  } else {
      alert("Please enter token, Class ID, and cookies.");
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "displayData") {
        document.getElementById("result").innerText = JSON.stringify(message.data, null, 2);
    } else if (message.action === "error") {
        alert("Error: " + message.message);
    } else if (message.action === "registrationSuccess") {
        alert("Registration successful!");
    } else if (message.action === "registrationFailure") {
        alert("Registration failed: " + message.message);
    }
});