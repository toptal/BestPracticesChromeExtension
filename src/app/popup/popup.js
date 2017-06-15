var hasRun = false;

(function () {
    browser = chrome.tabs ? chrome : browser;
    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        browser.tabs.executeScript(tabs[0].id, { file: "/popup/rules.js", runAt: "document_end" });
    });

    browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {

        if (!hasRun && request.type === "done") {
            hasRun = true;
            var result = request.data;

            Ajax.load(result, updateItem);
            createResults(result);
        }
    });

    document.getElementById("results").addEventListener("click", function (e) {

        var li = e.target;
        if (li.tagName === "P")
            li = li.parentNode;

        if (li.tagName !== "LI")
            return;

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

        document.getElementById("results").innerText = "";

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
                var a = document.createElement("a");
                a.innerText = page[cat][item].description;
                a.href = page[cat][item].url;
                span.appendChild(a);
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
                if (item.url) {
                    var a = document.createElement("a");
                    a.innerText = item.description;
                    a.href = item.url;
                    span.replaceChild(a, span.firstChild);
                }
                else {
                    span.innerText = item.description;
                }
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