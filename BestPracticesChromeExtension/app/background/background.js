var page; // used by the popup

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {

    if (request.action)
        return;

    page = request;
    
    chrome.extension.sendRequest("done");

    sendResponse({});
});