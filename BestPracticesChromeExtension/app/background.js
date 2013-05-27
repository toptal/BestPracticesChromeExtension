var lastTab,
    pages = {};

function getPage() {
    return pages["tab" + lastTab.id];
}

function setPage(page) {
    pages["tab" + lastTab.id] = page;
}

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {

    lastTab = sender.tab;
    setPage(request);
    xhrRequests();
    chrome.pageAction.show(sender.tab.id);

    sendResponse({});
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {

    lastTab = sender.tab;
    chrome.pageAction.show(lastTab);
    sendResponse({});
});

function updateBadge() {

    var fails = 0, success = 0;
    var page = getPage();

    for (var cat in page) {
        for (var key in page[cat]) {

            var result = page[cat][key].result;

            if (result === false)
                fails += 1;
            else if (result === true)
                success += 1;
        }
    }

    var percent = success / (fails + success) * 100;
    page.percent = percent;

    if (percent > 80) {
        chrome.pageAction.setIcon({ tabId: lastTab.id, path: "app/img/success-19.png" });
    }
    else if (percent >= 50) {
        chrome.pageAction.setIcon({ tabId: lastTab.id, path: "app/img/warning-19.png" });
    }
    else {
        chrome.pageAction.setIcon({ tabId: lastTab.id, path: "app/img/failure-19.png" });
    }
}

function xhrRequests() {
    page = getPage();

    getUrl(page.url + "/robots.txt", function (xhr) {
        page.SEO.robotstxt = { text: "Robots.txt exist", result: xhr.status === 200 };
        //page.SEO.sitemap = { text: "Sitemap.xml exist", result: xhr.responseText.indexOf("sitemap") > -1 };
        setPage(page);
    });

    //getUrl(page.url + "/humans.txt", function (xhr) {
    //    page.Usability.humanstxt = { text: "Humans.txt exist", result: xhr.status === 200 };
    //    setPage(page);
    //});
}

function getUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime(), true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            callback(xhr);
            updateBadge();
        }
    };
    xhr.send();
}