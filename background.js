function listener(details) {
    console.log("Hi!");
    let updateData = {
        url: "index.html"
      };
    let updating = browser.tabs.update(updateData);
    console.log("Bye!");
    return {"cancel": true};
}

browser.webRequest.onBeforeRequest.addListener(
    listener,
    {urls: ["*://yle.fi/*"], types: ["main_frame"]},
    ["blocking"]
);
