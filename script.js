function listener(message, sender, sendResponse){
    let webpage = message.targetUrl;
    function continueToPage(){
        console.log("Continuing to: ", webpage);
        browser.tabs.update({"url": webpage}); //TODO: Instead of doing this itself send to background script so it can disable filter for the page
    }
    document.getElementById("continue-button").addEventListener("click", continueToPage);
    document.getElementById("continue-button").disabled = false;
    //return true;
}

browser.runtime.onMessage.addListener(listener);
