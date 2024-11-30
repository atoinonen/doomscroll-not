function addDoomscrollPage() {
    browser.tabs.query({ "active": true, "currentWindow": true }).then((tab) => {
        if (tab.length !== 1) {
            console.log(tab);
            console.error("TOO MANY (or few) TABS!");
            return;
        }
        let url = tab[0].url;
        console.log("Add page", url, "to banned list.");
        browser.runtime.sendMessage({ "blockedUrl": url });
    });
}

document.getElementById("add_page").addEventListener("click", addDoomscrollPage);