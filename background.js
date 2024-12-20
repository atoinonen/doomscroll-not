{
    function listener(details) {
        console.log("Hi! Going to: ", details.url);
        let updateData = {
            url: "index.html"
        };
        browser.tabs.update(details.tabId, updateData).then(tab => sendMessage(tab.id, details.url, 5000)).catch((err) => console.error(err));
        console.log("Bye!");
        return { "cancel": true };
    }

    function sendMessage(tabId, targetUrl, delay) {
        return new Promise((resolve) => {
            setTimeout(() => {
                browser.tabs.sendMessage(tabId, { "targetUrl": targetUrl }).catch((err) => console.error(err));
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

    function addDoomscrollPage(message, sender, sendResponse) {
        if (message.blockedUrl === undefined) {
            return;
        }
        let url = new URL(message.blockedUrl);
        let blockedSite = "*://" + url.hostname + "/*";
        browser.storage.local.get("doomscrollSites").then(item => {
            item.doomscrollSites.push(blockedSite);
            browser.storage.local.set(item);
        });

        doomscrollSites.push(blockedSite);

        console.log("Listener 1: ", browser.webRequest.onBeforeRequest.hasListener(listener));
        browser.webRequest.onBeforeRequest.removeListener(listener);
        console.log("Listener 2: ", browser.webRequest.onBeforeRequest.hasListener(listener));
        browser.webRequest.onBeforeRequest.addListener(
            listener,
            { urls: doomscrollSites, types: ["main_frame"] },
            ["blocking"]
        );
        console.log("Doomscroll sites: ", doomscrollSites);
    }

    let doomscrollSites = [];

    // *://www.youtube.com/shorts/* doesn't work when using links from youtube.com because instead of loading a new page (type=main_frame)
    // youtube uses XMLHttpRequest so the listener doesn't fire. Changing listener's type from main_frame to fix this problem introduces a LOT of new problems.
    browser.storage.local.set({ "doomscrollSites": ["*://yle.fi/*", "*://www.reddit.com/*", "*://www.youtube.com/shorts/*", "*://www.youtube.com/*"] }).then(() => //For testing
    browser.storage.local.get("doomscrollSites").then(item => {
        console.log("Item: ", item);
        doomscrollSites = item.doomscrollSites;
        browser.webRequest.onBeforeRequest.addListener(
            listener,
            { urls: doomscrollSites, types: ["main_frame"] },
            ["blocking"]
        );
        browser.runtime.onMessage.addListener(continueToPage);
        browser.runtime.onMessage.addListener(addDoomscrollPage);
    }).catch((err) => console.error(err))
    ).catch((err) => console.error(err)); //For testing
}