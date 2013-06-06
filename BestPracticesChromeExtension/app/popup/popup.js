
(function () {

    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.executeScript(tab.id, { file: "popup/rules.js", runAt: "document_end" }, function (response) { });
    });

    chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
        if (request === "done") {
            var bgp = chrome.extension.getBackgroundPage();

            Ajax.load(bgp.page, updateItem);
            createResults(bgp.page);
        }
    });

    document.getElementById("webdevchecklist").addEventListener("click", function (e) {
        window.open(e.target.href);
    });

    function createResults(page) {

        document.getElementById("results").innerHTML = "";

        for (var cat in page) {

            if (cat === "url")
                continue;

            var ul = document.querySelector("ul[data-cat='" + cat + "']") || createHeader(cat);

            for (var item in page[cat]) {

                var li = document.createElement("li");
                li.innerText = page[cat][item].text;
                li.className = page[cat][item].result;
                li.setAttribute("data-item", item);

                ul.appendChild(li);
            }
        }

        reportProgress();
    }

    function createHeader(cat) {
        var ul = document.createElement("ul");
        ul.setAttribute("data-cat", cat);

        var header = document.createElement("li");
        header.innerText = cat;
        ul.appendChild(header);

        document.getElementById("results").appendChild(ul);

        return ul;
    }

    function updateItem(key, item) {

        var li = document.querySelector("li[data-item='" + key + "']");

        if (li) {
            li.className = item.result;
            li.innerText = item.text;
            reportProgress();
        }
    }

    function reportProgress() {
        var fail = document.querySelectorAll(".false").length;
        var success = document.querySelectorAll(".true").length;
        var percent = success / (fail + success) * 100;

        var progress = document.getElementById("progress");
        progress.querySelector("strong").style.left = percent - 3 + "%";
        progress.title = Math.round(percent) + "%";
    }
})();