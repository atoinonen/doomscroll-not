function listener(message, sender, sendResponse){
    let webpage = message.targetUrl;
    function continueToPage(){
        console.log("Continuing to: ", webpage);
        //browser.tabs.update(webpage);
    }
    document.getElementById("continue-button").addEventListener("click", continueToPage);
    document.getElementById("continue-button").disabled = false;
    //return true;
}

browser.runtime.onMessage.addListener(listener);
