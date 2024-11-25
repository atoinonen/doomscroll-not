function listener(details) {
    console.log("Hi! Going to: ", details.url);
    console.log("Whitelist:", whitelist);
    for (const site of whitelist) {
        console.log("Whitelisted site:", site);
        if (details.url.match(site)) {
            console.log("Continuing to ", details.url);
            return {};
        }
    }
    let updateData = {
        url: "index.html"
    };
    browser.tabs.update(updateData).then(tab => sendMessage(tab.id, details.url, 5000)).catch((err) => console.error(err));
    console.log("Bye!");
    return { "cancel": true };
}

function sendMessage(tabId, targetUrl, delay) {
    return new Promise((resolve) => {
        setTimeout(() => {
            browser.tabs.sendMessage(tabId, { "targetUrl": targetUrl });
            resolve("Message sent");
        }, delay);
    });
}

function continueToPage(message, sender, sendResponse) {
    if (message.continue === true) {
        let doomscrollSitesRegEx = doomscrollSites.map((site) => new RegExp(site.replaceAll(".", "\\.").replaceAll("*", ".*?").replaceAll("/", "\\/"), "g"));
        console.log("Whitelist 1: ", whitelist);
        whitelist.push(...doomscrollSitesRegEx.filter(site => message.webpage.match(site)));
        console.log("Whitelist 2: ", whitelist);
        //whitelist = whitelist.map((site) => new RegExp(site.replaceAll(".", "\\.").replaceAll("*", ".*?").replaceAll("/", "\\/"), "g"));
        console.log("Whitelist 3: ", whitelist);
        browser.tabs.update({ "url": message.webpage });
        return true;
    } else {
        return false;
    }
}


doomscrollSites = ["*://yle.fi/*", "*://www.reddit.com/*"];
whitelist = [];

browser.webRequest.onBeforeRequest.addListener(
    listener,
    { urls: doomscrollSites, types: ["main_frame"] },
    ["blocking"]
);

browser.runtime.onMessage.addListener(continueToPage);