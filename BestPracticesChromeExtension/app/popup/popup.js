
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

    document.getElementById("results").addEventListener("click", function (e) {

        var li = e.target;
        if (li.tagName === "P")
            li = li.parentNode;

        if (li.tagName !== "LI")
            return

        var span = li.querySelector("span");

        if (!span)
            return;

        if (li.getAttribute("data-active") === null) {

            var prev = document.querySelector("[data-active]");
            if (prev) prev.removeAttribute("data-active");

            li.setAttribute("data-active", "ost");

        }
        else {
            li.removeAttribute("data-active");
        }
    });

    document.body.addEventListener("click", function (e) {
        if (e.target.tagName === "A")
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
                li.className = page[cat][item].result;
                li.setAttribute("data-item", item);

                var text = document.createElement("p");
                text.innerText = page[cat][item].text;
                li.appendChild(text);

                var span = document.createElement("span");
                span.innerHTML = page[cat][item].description;
                li.appendChild(span);


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
            li.firstChild.innerText = item.text;

            var span = li.querySelector("span");

            if (span) {
                span.innerHTML = item.description;
            }

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