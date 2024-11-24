function listener(details) {
    console.log("Hi! Going to: ", details.url);
    let updateData = {
        url: "index.html"
      };
    browser.tabs.update(updateData).then(tab => sendMessage(tab.id, details.url, 5000)).catch((err) => console.error(err));
    console.log("Bye!");
    return {"cancel": true};
}

function sendMessage(tabId, targetUrl, delay) {
    return new Promise((resolve) => {
      setTimeout(() => {
        browser.tabs.sendMessage(tabId, {"targetUrl": targetUrl});
        resolve("Message sent");
      }, delay);
    });
  }
  

browser.webRequest.onBeforeRequest.addListener(
    listener,
    {urls: ["*://yle.fi/*"], types: ["main_frame"]},
    ["blocking"]
);

//TODO: Add listener for button press from content script.
//Disable filter for the session (so request goes through)
//and change tab.