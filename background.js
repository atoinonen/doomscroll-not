{
    function listener(details) {
        console.log("Hi! Going to: ", details.url);
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
            console.log("DoomscrollSites: ", doomscrollSites);
            doomscrollSites = doomscrollSites.filter(site => message.webpage.match(new RegExp(site.replaceAll(".", "\\.").replaceAll("*", ".*?").replaceAll("/", "\\/"), "g")) === null);
            console.log("DoomscrollSites 2: ", doomscrollSites);

            console.log("Listener 1: ", browser.webRequest.onBeforeRequest.hasListener(listener));
            browser.webRequest.onBeforeRequest.removeListener(listener);
            console.log("Listener 2: ", browser.webRequest.onBeforeRequest.hasListener(listener));
            browser.webRequest.onBeforeRequest.addListener(
                listener,
                { urls: doomscrollSites, types: ["main_frame"] },
                ["blocking"]
            );
            console.log("Listener 3: ", browser.webRequest.onBeforeRequest.hasListener(listener));
            browser.tabs.update({ "url": message.webpage });
            return true;
        } else {
            return false;
        }
    }

    let doomscrollSites = [];

    browser.storage.local.set({ "doomscrollSites": ["*://yle.fi/*", "*://www.reddit.com/*", "*://www.youtube.com/shorts/*"] }).then(() => //For testing
    browser.storage.local.get("doomscrollSites").then(item => {
        console.log("Item: ", item);
        doomscrollSites = item.doomscrollSites;
        browser.webRequest.onBeforeRequest.addListener(
            listener,
            { urls: doomscrollSites, types: ["main_frame"] },
            ["blocking"]
        );
        browser.runtime.onMessage.addListener(continueToPage);
    }).catch((err) => console.error(err))
    ).catch((err) => console.error(err)); //For testing
}