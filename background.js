function listener(details) {
    console.log("Hi! Going to: ", details.url);
    let updateData = {
        url: "index.html"
      };
    //TODO: sendMessage tries to send the message too quickly, the content script doesn't yet have a listener. Works when debugging and using breakpoints.
    browser.tabs.update(updateData).then(tab => browser.tabs.sendMessage(tab.id, {"targetUrl": details.url})).catch((err) => console.error(err));
    console.log("Bye!");
    return {"cancel": true};
}

browser.webRequest.onBeforeRequest.addListener(
    listener,
    {urls: ["*://yle.fi/*"], types: ["main_frame"]},
    ["blocking"]
);
