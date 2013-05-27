
(function () {

    var div = document.getElementById("results");
    var bgp = chrome.extension.getBackgroundPage();
    var page = bgp.getPage();

    function update() {
        div.innerHTML = "";

        for (var cat in page) {

            if (cat === "url" || cat === "percent" || cat === "rawUrl")
                continue;

            createItems(cat);
        }

        //var progress = document.getElementById("progress");
        //progress.value = page.percent;
        //progress.title = Math.round(page.percent) + "%";
    }

    function createItems(cat) {
        var ul = document.querySelector("ul[data-cat='" + cat + "']");

        if (ul === null) {

            ul = document.createElement("ul");
            ul.setAttribute("data-cat", cat);

            var header = document.createElement("li");
            header.innerText = cat;
            ul.appendChild(header);

            div.appendChild(ul);
        }

        for (var key in page[cat]) {

            var li = document.createElement("li");
            li.innerText = page[cat][key].text;
            li.className = page[cat][key].result;

            ul.appendChild(li);
        }
    }

    document.getElementById("webdevchecklist").addEventListener("click", function (e) {
        window.open(e.target.href);
    });

    if ((!page.Performance || !page.Performance.pagespeed) && page.url.indexOf("localhost") === -1) {
        bgp.getUrl("https://www.googleapis.com/pagespeedonline/v1/runPagespeed?url=" + page.url + "&key=AIzaSyCUKP2H8Tq02_EmppV1oct2K_gOaZquA3s&prettyprint=false", function (xhr) {
            if (xhr.status === 200) {
                var score = JSON.parse(xhr.responseText).score;
                page.Performance = page.Performance || {};
                page.Performance.pagespeed = { text: "Google PageSpeed score of " + score + "/100", result: score > 90 };
                bgp.setPage(page);
                createItems("Performance");
            }
        });
    }

    update();

})();
