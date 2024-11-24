function listener(details) {
    console.log("Hi! Going to: ", details.url);
    let updateData = {
        url: "index.html"
      };
    browser.tabs.update(updateData).then(tab => doSomething(tab.id, details.url)).catch((err) => console.error(err));
    console.log("Bye!");
    return {"cancel": true};
}

function doSomething(tabId, targetUrl) {
    return new Promise((resolve) => {
      setTimeout(() => {
        browser.tabs.sendMessage(tabId, {"targetUrl": targetUrl});
        resolve("Message sent");
      }, 5000);
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