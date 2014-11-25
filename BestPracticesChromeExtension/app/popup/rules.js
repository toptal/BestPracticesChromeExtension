
(function () {
    var stylesheets = document.styleSheets.length,
        count = 0;

    function load() {
        var domElements = document.getElementsByTagName("*").length,
            result = {
                url: location.protocol + "//" + location.host,
                "SEO": {
                    microdata: {
                        text: "Add meaning with Microdata",
                        result: document.querySelector("[itemscope]") !== null,
                        description: "<a href='http://schema.org/'>Schema.org referrence</a>"
                    },
                    description: {
                        text: "Meta description",
                        result: document.querySelector("meta[name=description]") !== null,
                        description: "<a href='http://www.agent-seo.com/seo/meta-description-optimization-writing-effective-meta-descriptions-for-seo/'>Meta description</a>"
                    },
                    //h1: { text: "Use <h1> once per page", result: document.querySelectorAll("h1").length === 1, description: "<a href='http://tools.seobook.com/robots-txt/'>Robots.txt tutorial</a>" },
                    robotstxt: {
                        text: "Robots.txt exist",
                        result: "n/a",
                        description: "<a href='http://tools.seobook.com/robots-txt/'>Robots.txt tutorial</a>"
                    },
                },
                "Mobile": {
                    mediaqueries: {
                        text: "CSS Media Queries",
                        result: mediaQueryLocal(),
                        description: "<a href='http://cssmediaqueries.com/what-are-css-media-queries.html'>Media queries explained</a>"
                    },
                    viewport: {
                        text: "Viewport meta tag",
                        result: document.querySelector("meta[name='viewport']") !== null,
                        description: "<a href='https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag'>Using the viewport</a>"
                    },
                },
                "Usability": {
                    favicon: {
                        text: "Favicon",
                        result: document.querySelector("link[rel='shortcut icon']") !== null || document.querySelector("meta[itemprop='image']") !== null,
                        description: "<a href='http://www.xiconeditor.com/'>Online generator</a>"
                    },
                    friendlyurls: {
                        text: "Use friendly URLs",
                        result: location.href.indexOf("?") === -1,
                        description: "<a href='http://www.techterms.com/definition/friendly_url'>Explanation and guide</a>"
                    },
                    validator: {
                        text: "W3C validator",
                        result: "n/a",
                        html: document.documentElement.outerHTML,
                        description: "<a href='http://validator.w3.org/'>Online W3C validator</a>"
                    },
                },
                "Accessibility": {
                    landmarks: {
                        text: "WAI-ARIA Landmarks",
                        result: document.querySelector("[role]") !== null,
                        description: "<a href='http://accessibility.oit.ncsu.edu/blog/2011/06/30/using-aria-landmarks-a-demonstration/'>Using Landmarks</a>"
                    },
                    alt: {
                        text: "Use 'alt' attributes on images",
                        result: document.querySelector("img:not([alt])") === null,
                        description: "<a href='http://accessibility.psu.edu/images'>Image 'alt' attribute tips</a>"
                    },
                },
                "Environment integration": {
                    twitter: {
                        text: "Twitter Cards",
                        result: document.querySelector("meta[name='twitter:title']") !== null,
                        description: "<a href='https://dev.twitter.com/docs/cards'>Introduction to Twitter Cards</a>"
                    },
                    opengraph: {
                        text: "OpenGraph/Facebook",
                        result: document.querySelector("meta[property^='og:']") !== null,
                        description: "<a href='http://ogp.me/'>OpenGraph protocol reference</a>"
                    },
                    windows: {
                        text: "Windows 8/Windows Phone",
                        result: document.querySelector("meta[name='application-name']") !== null || document.querySelector("meta[name^='msapplication']") !== null,
                        description: "<a href='http://www.buildmypinnedsite.com/'>IE guide</a>"
                    },
                    ios: {
                        text: "Apple iOS",
                        result: document.querySelector("link[rel^='apple-']") !== null,
                        description: "<a href='http://developer.apple.com/library/ios/#documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html'>iOS integration</a>"
                    },
                },
                "Performance": {
                    elements: {
                        text: "Number of DOM elements (" + domElements + ")",
                        result: domElements < 2000,
                        description: "<a href='http://www.xpertdeveloper.com/2010/08/reduce-the-number-of-dom-elements-to-speed-up-your-website/'>Reduce the # of DOM elements</a>"
                    },
                    pagespeed: {
                        text: "Google PageSpeed (loading...)",
                        result: "n/a",
                        description: "<a href='https://chrome.google.com/webstore/detail/pagespeed-insights-by-goo/gplegfbjlmmehdoakndmohflojccocli'>Download Google Page Speed</a>"
                    },
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
                if (css.rules[r] && css.rules[r].type === window.CSSRule.MEDIA_RULE) {
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