
(function () {
    var stylesheets = document.styleSheets.length,
        count = 0;

    function load() {
        var domElements = document.getElementsByTagName("*").length,
            result = {
                url: location.protocol + "//" + location.host,
                "SEO": {
                    microdata: { text: "Add meaning with Microdata", result: document.querySelector("[itemscope]") !== null },
                    keywords: { text: "Meta keywords and description", result: document.querySelector("meta[name=keywords]") !== null && document.querySelector("meta[name=description]") !== null },
                    h1: { text: "Use <h1> once per page", result: document.querySelectorAll("h1").length === 1 },
                    robotstxt: { text: "Robots.txt exist", result: "n/a" },
                },
                "Mobile": {
                    mediaqueries: { text: "CSS Media Queries", result: mediaQueryLocal() },
                    viewport: { text: "Viewport meta tag", result: document.querySelector("meta[name='viewport']") !== null },
                },
                "Usability": {
                    favicon: { text: "Favicon", result: document.querySelector("link[rel='shortcut icon']") !== null || document.querySelector("meta[itemprop='image']") !== null },
                    friendlyurls: { text: "Use friendly URLs", result: location.href.indexOf("?") === -1 },
                    landmarks: { text: "WAI-ARIA Landmarks", result: document.querySelector("[role]") !== null },
                },
                "Environment integration": {
                    twitter: { text: "Twitter", result: document.querySelector("meta[name='twitter:title']") !== null },
                    opengraph: { text: "OpenGraph/Facebook", result: document.querySelector("meta[name^='og:'], meta[property^='og:']") !== null },
                    windows: { text: "Windows/Windows Phone", result: document.querySelector("meta[name='application-name']") !== null || document.querySelector("meta[name^='msapplication']") !== null },
                    ios: { text: "Apple iOS", result: document.querySelector("link[rel^='apple-']") !== null },
                },
                "Performance": {
                    elements: { text: "Number of DOM elements (" + domElements + ")", result: domElements < 2000 },
                    pagespeed: { text: "Google PageSpeed (loading...)", result: "n/a" },
                }
            };

        if (!result.Mobile.mediaqueries.result) {
            mediaQueryRemote(function (state) {
                result.Mobile.mediaqueries.result = state;
                chrome.extension.sendRequest(result, function (response) { });
            });
        }
        else {
            chrome.extension.sendRequest(result, function (response) { });
        }
    };

    function mediaQueryLocal() {

        var links = document.querySelectorAll("link[media]");

        for (var i = 0; i < links.length; i++) {
            var attr = links[i].getAttribute("media");
            if (attr !== "print" && attr !== "screen" && attr !== "handheld" && attr !== "aural" && attr !== "projection" && attr !== "tv" && attr !== "braille")
                return true;
        }

        for (var s = 0; s < document.styleSheets.length; s++) {
            var css = document.styleSheets[s];

            if (css.cssRules === null)
                continue;

            for (var r = 0; r < css.cssRules.length; r++) {
                if (css.rules[r].type === window.CSSRule.MEDIA_RULE) {
                    return true;
                }
            }
        }

        return false;
    };

    function mediaQueryRemote(callback) {

        if (stylesheets === 0) {
            callback(false);
        }

        for (var s = 0; s < stylesheets; s++) {
            var css = document.styleSheets[s];

            if (css.href && (css.href.indexOf("http://") === 0 || css.href.indexOf("https://") === 0)) {

                var xhr = new XMLHttpRequest();
                xhr.open("GET", css.href, true);
                xhr.onreadystatechange = function () {

                    if (xhr.readyState === 4)
                        confirm(xhr, callback);

                };
                xhr.send();
            }
            else {
                confirm(null, callback);
            }
        }
    };

    function confirm(xhr, callback) {

        count += 1;

        if (xhr && xhr.status === 200 && xhr.responseText.indexOf("@media")) {
            callback(true);
        }
        else if (stylesheets === count) {
            callback(false);
        }
    }

    load();
})();