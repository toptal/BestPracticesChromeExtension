/// <reference path="mediaqueries.js" />
/// <reference path="favicon.js" />

var url = location.protocol + "//" + location.host,
    result = {
        url: url,
        rawUrl: location.href,
        "SEO": {
            microdata: { text: "Add meaning with Microdata", result: document.querySelector("[itemscope]") !== null },
            keywords: { text: "Meta keywords and description", result: document.querySelector("meta[name=keywords]") !== null && document.querySelector("meta[name=description]") !== null },
            h1: { text: "Use <h1> once per page", result: document.querySelectorAll("h1").length === 1 },
        },
        "Mobile": {
            mediaqueries: { text: "CSS Media Queries", result: rules.mediaQueryLocal() },
            viewport: { text: "Viewport meta tag", result: document.querySelector("meta[name='viewport']") !== null },
        },
        "Usability": {
            favicon: { text: "Favicon", result: false },
            friendlyurls: { text: "Use friendly URLs", result: location.href.indexOf("?") === -1 },
            landmarks: { text: "WAI-ARIA Landmarks", result: document.querySelector("[role]") !== null },
        },
        "Environment integration": {
            twitter: { text: "Twitter", result: document.querySelector("meta[name='twitter:title']") !== null },
            opengraph: { text: "OpenGraph/Facebook", result: document.querySelector("meta[name^='og:']") !== null },
            windows: { text: "Windows/Windows Phone", result: document.querySelector("meta[name='application-name']") !== null || document.querySelector("meta[name^='msapplication']") !== null },
            ios: { text: "Apple iOS", result: document.querySelector("link[rel^='apple-']") !== null },
        }
    };

rules.favicon(function (state) {
    result.Usability.favicon.result = state;
    chrome.extension.sendRequest(result, function (response) { });
});

window.addEventListener("load", function () {

    if (!result.Mobile.mediaqueries.result) {
        rules.mediaQueryRemote(function (state) {
            result.Mobile.mediaqueries.result = state;
            chrome.extension.sendRequest(result, function (response) { });
        });
    }
});

window.addEventListener("focus", function () {
    chrome.runtime.sendMessage("focus");
});