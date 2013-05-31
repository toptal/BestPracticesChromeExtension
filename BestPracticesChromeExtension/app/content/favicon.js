var rules = rules || {};

rules.favicon = function (callback) {

    var inPage = document.querySelector("link[rel='shortcut icon']") !== null || document.querySelector("meta[itemprop='image']") !== null;

    if (inPage) {
        callback(true);
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url + "/favicon.ico" + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime(), true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            callback(xhr.status === 200);
        }
    };
    xhr.send();
};