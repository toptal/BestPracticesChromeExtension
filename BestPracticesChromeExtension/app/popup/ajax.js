
var Ajax = (function () {

    function load(page, updateItem) {

        // Google PageSpeed
        if (page.url.indexOf("localhost") === -1 && page.url.indexOf("file://") === -1) {
            getUrl("https://www.googleapis.com/pagespeedonline/v1/runPagespeed?url=" + page.url + "&key=AIzaSyCUKP2H8Tq02_EmppV1oct2K_gOaZquA3s&prettyprint=false", function (xhr) {
                if (xhr.status === 200) {
                    var score = JSON.parse(xhr.responseText).score;
                    page.Performance.pagespeed.text = "Google PageSpeed score of " + score + "/100";
                    page.Performance.pagespeed.result = score > 90;
                    updateItem("pagespeed", page.Performance.pagespeed);
                }
                else {
                    page.Performance.pagespeed.text = "Google PageSpeed (quota limit)";
                    page.Performance.pagespeed.description = "The daily quota has been reached<br />" + page.Performance.pagespeed.description;
                    updateItem("pagespeed", page.Performance.pagespeed);
                }
            });
        }
        else {
            page.Performance.pagespeed.text = "Google PageSpeed (remote only)";
            updateItem("pagespeed", page.Performance.pagespeed);
        }

        // Robots.txt and XML Sitemap
        getUrl(page.url + "/robots.txt", function (xhr) {
            page.SEO.robotstxt.result = (xhr.status === 200);
            //page.SEO.sitemap = { text: "Sitemap.xml exist", result: xhr.responseText.indexOf("sitemap") > -1 };
            updateItem("robotstxt", page.SEO.robotstxt);
        });

        // Favicon
        if (!page.Usability.favicon.result) {
            getUrl(page.url + "/favicon.ico", function (xhr) {
                if (xhr.status === 200) {
                    page.Usability.favicon.result = true;
                    updateItem("favicon", page.Usability.favicon);
                }
            });
        }

        // W3C validation
        if (page.Usability.validator.result === "n/a") {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "https://html5.validator.nu?out=json&level=error&laxtype=yes", true);
            xhr.setRequestHeader("Content-type", "text/html");
            xhr.onload = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var json = JSON.parse(xhr.responseText);
                    var errors = json.messages.length;

                    page.Usability.validator.result = errors === 0;
                    page.Usability.validator.text += " (" + errors + " errors)";

                    if (errors > 0) {
                        page.Usability.validator.description = "";

                        for (var i = 0; i < json.messages.length; i++) {
                            page.Usability.validator.description += "<mark title='Line: " + json.messages[i].lastLine + " Column: " + json.messages[i].lastColumn + "'>" + json.messages[i].message + "</mark>";
                        }
                    }

                    updateItem("validator", page.Usability.validator);
                }
            };

            xhr.send(page.Usability.validator.html);
        }
    }

    function getUrl(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime(), true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                callback(xhr);
            }
        };
        xhr.send();
    }

    return {
        load: load
    };
})();