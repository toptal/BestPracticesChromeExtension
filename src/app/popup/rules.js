function GetBrowser() {
    try {
        if (browser.runtime)
            return browser;
    } catch (e) {
        return chrome;
    }
}

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
                        result: document.querySelector("[itemscope]") !== null || document.querySelector("script[type='application/ld+json']") !== null,
                        description: "Schema.org referrence",
                        url:"http://schema.org/"
                    },
                    description: {
                        text: "Meta description",
                        result: document.querySelector("head>meta[name=description]") !== null,
                        description: "Meta description",
                        url: "http://www.agent-seo.com/seo/meta-description-optimization-writing-effective-meta-descriptions-for-seo/"
                    },
                    //h1: { text: "Use <h1> once per page", result: document.querySelectorAll("h1").length === 1, description: "<a href='http://tools.seobook.com/robots-txt/'>Robots.txt tutorial</a>" },
                    robotstxt: {
                        text: "Robots.txt exist",
                        result: "n/a",
                        description: "Robots.txt tutorial",
                        url:"http://tools.seobook.com/robots-txt/"
                    }
                },
                "Mobile": {
                    mediaqueries: {
                        text: "CSS Media Queries",
                        result: mediaQueryLocal(),
                        description: "Media queries explained",
                        url: "http://cssmediaqueries.com/what-are-css-media-queries.html"
                    },
                    viewport: {
                        text: "Viewport meta tag",
                        result: document.querySelector("head>meta[name='viewport']") !== null,
                        description: "Using the viewport",
                        url:"https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag"
                    }
                },
                "Usability": {
                    favicon: {
                        text: "Favicon",
                        result: document.querySelector("head>link[rel='shortcut icon']") !== null || document.querySelector("meta[itemprop='image']") !== null,
                        description: "Online generator",
                        url: "http://www.xiconeditor.com/"
                    },
                    friendlyurls: {
                        text: "Use friendly URLs",
                        result: location.href.indexOf("?") === -1,
                        description: "Explanation and guide",
                        url: "http://www.techterms.com/definition/friendly_url"
                    },
                    validator: {
                        text: "HTML validation",
                        result: "n/a",
                        html: GetHtml(document),
                        description: "Online validator",
                        url: "http://validator.nu/"
                    }
                },
                "Accessibility": {
                    landmarks: {
                        text: "WAI-ARIA Landmarks",
                        result: document.querySelector("[role]") !== null,
                        description: "Using Landmarks",
                        url: "http://accessibility.oit.ncsu.edu/blog/2011/06/30/using-aria-landmarks-a-demonstration/"
                    },
                    alt: {
                        text: "Use 'alt' attributes on images",
                        result: document.querySelector("img:not([alt])") === null,
                        description: "Image 'alt' attribute tips",
                        url: "http://accessibility.psu.edu/images"
                    }
                },
                "Environment integration": {
                    twitter: {
                        text: "Twitter Cards",
                        result: document.querySelector("meta[name='twitter:title']") !== null,
                        description: "Introduction to Twitter Cards",
                        url:"https://dev.twitter.com/docs/cards"
                    },
                    opengraph: {
                        text: "OpenGraph/Facebook",
                        result: document.querySelector("meta[property^='og:']") !== null,
                        description: "OpenGraph protocol reference",
                        url: "http://ogp.me/"
                    },
                    windows: {
                        text: "Windows",
                        result: document.querySelector("meta[name='application-name']") !== null || document.querySelector("meta[name^='msapplication']") !== null,
                        description: "IE guide",
                        url: "http://www.buildmypinnedsite.com/"
                    },
                    ios: {
                        text: "Apple iOS",
                        result: document.querySelector("link[rel^='apple-']") !== null,
                        description: "iOS integration",
                        url: "http://developer.apple.com/library/ios/#documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html"
                    }
                },
                "Performance": {
                    elements: {
                        text: "Number of DOM elements (" + domElements + ")",
                        result: domElements < 2000,
                        description: "Reduce the # of DOM elements",
                        url: "http://www.xpertdeveloper.com/2010/08/reduce-the-number-of-dom-elements-to-speed-up-your-website/"
                    },
                    pagespeed: {
                        text: "Google PageSpeed (loading...)",
                        result: "n/a",
                        description: "Google PageSpeed online",
                        url: "https://developers.google.com/speed/pagespeed/insights/"
                    }
                }
            };

        if (!result.Mobile.mediaqueries.result) {
            mediaQueryRemote(function (state) {
                result.Mobile.mediaqueries.result = state;
                GetBrowser().runtime.sendMessage({ type: "result", data: result }, function (response) { });
            });
        }
        else {
            GetBrowser().runtime.sendMessage({ type: "result", data: result }, function (response) { });
        }
    }

    function mediaQueryLocal() {

        var links = document.querySelectorAll("link[media]");

        for (var i = 0; i < links.length; i++) {
            var attr = links[i].getAttribute("media");
            if (attr !== "print" && attr !== "screen" && attr !== "handheld" && attr !== "aural" && attr !== "projection" && attr !== "tv" && attr !== "braille")
                return true;
        }

        try {
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
        }
        catch (ex) {
            return false;
        }

        return false;
    }

    function mediaQueryRemote(callback) {

        if (stylesheets === 0) {
            callback(false);
        }

        for (var s = 0; s < stylesheets; s++) {
            var css = document.styleSheets[s];

            if (css.href && (css.href.indexOf("http://") === 0 || css.href.indexOf("https://") === 0)) {

                var xhr = new XMLHttpRequest();
                xhr.open("GET", css.href, true);
                xhr.onload = function () {

                    if (xhr.readyState === 4)
                        confirm(xhr, callback);

                };
                xhr.send();
            }
            else {
                confirm(null, callback);
            }
        }
    }

    function confirm(xhr, callback) {

        count += 1;

        if (xhr && xhr.status === 200 && xhr.responseText.indexOf("@media")) {
            callback(true);
        }
        else if (stylesheets === count) {
            callback(false);
        }
    }

    function GetHtml(document) {
        var node = document.doctype;
        var doctype = "<!DOCTYPE "
            + node.name
            + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '')
            + (!node.publicId && node.systemId ? ' SYSTEM' : '')
            + (node.systemId ? ' "' + node.systemId + '"' : '')
            + '>';

        return doctype + document.documentElement.outerHTML;
    }

    load();
})();