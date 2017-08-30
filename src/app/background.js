function sendMessage(extObject, request) {
    if (request.type === "result") {
        extObject.runtime.sendMessage({ type: "done", data: request.data }, function (response) { });
    }
}

if (chrome.runtime) {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        sendMessage(chrome, request);
    });
}
else if (browser.runtime) {
    browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        sendMessage(browser, request);
    });
}