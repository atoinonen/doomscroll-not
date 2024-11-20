function listener(details) {
    console.log("Hi!");
    return {"cancel": true};
}

browser.webRequest.onBeforeRequest.addListener(
    listener,
    {urls: ["*://yle.fi/*"], types: ["main_frame"]},
    ["blocking"]
);
