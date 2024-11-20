function listener(details) {
    console.log("Hi!");
    notify();
    return {"cancel": true};
}

function notify() {
    browser.notifications.create("confirmation", {
        "type": "basic",
        "title": "Doomscroll identified",
        "message": "Are you sure you want to ruin your day?"
    });
}

browser.webRequest.onBeforeRequest.addListener(
    listener,
    {urls: ["*://yle.fi/*"], types: ["main_frame"]},
    ["blocking"]
);
