let userID = document.getElementById('userID');
let imageURL = document.getElementById('imageURL');
let currentURL = document.getElementById('currentURL');
let category = document.getElementById('category');

function getCurrentTabUrl(callback) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs) {
        var tab = tabs[0];
        var url = tab.url;
        callback(url);
    });
}

function renderURL(currentURL) {
    console.log(currentURL);
    document.getElementById('resourceURL').textContent = currentURL;
}

// On DOM content loaded get current tab url and render
document.addEventListener('DOMContentLoaded', function() {
    getCurrentTabUrl(function(url) {
        renderURL(url);
    });
});

document.getElementById('resourceForm').addEventListener('submit', function(e) {
    var request = new XMLHttpRequest();
    console.log("user ID: " + userID.value + " imageURL: " + imageURL.value + " resourceURL: " + resourceURL.textContent + " category: " + category.value);
    request.open("POST", "https://c5102e1b.ngrok.io/api/posts", true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({link: resourceURL.textContent, imageURL: imageURL.value, categoryid: category.value, userid: userID.value})); //TODO: change category to id later
});
