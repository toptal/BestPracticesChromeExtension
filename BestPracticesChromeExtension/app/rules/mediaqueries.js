var rules = rules || {};

rules.mediaQueryLocal = function () {
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

rules.mediaQueryRemote = function (callback) {

    for (var s = 0; s < document.styleSheets.length; s++) {
        var css = document.styleSheets[s];

        if (css.href && (css.href.indexOf("http://") === 0 || css.href.indexOf("https://") === 0)) {

            var xhr = new XMLHttpRequest();
            xhr.open("GET", css.href, true);
            xhr.onreadystatechange = function () {

                if (xhr.readyState === 4 && xhr.status === 200 && xhr.responseText.indexOf("@media")) {
                    callback(true);
                }
            };
            xhr.send();
        }
    }
};