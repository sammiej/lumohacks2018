let userID = document.getElementById('userID');
let imageURL = document.getElementById('imageURL');
let resourceURL = document.getElementById('resourceURL');
let category = document.getElementById('category');
let title = document.getElementById('title');

function getCurrentTabUrl(callback) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs) {
        var tab = tabs[0];
        var url = tab.url;
        var title = tab.title;
        callback(url, title);
    });
}

function renderURL(currentURL, title) {
    console.log(currentURL + ' ' + title);
    document.getElementById('title').textContent = title;
    document.getElementById('resourceURL').textContent = currentURL;
}

// On DOM content loaded get current tab url and render
document.addEventListener('DOMContentLoaded', function() {
    getCurrentTabUrl(function(url, title) {
        renderURL(url, title);
    });
});

document.getElementById('resourceForm').addEventListener('submit', function(e) {
    //indexResource();
    postResource();
    //window.close();
});

function postResource() {
    // HTTP POST
    var request = new XMLHttpRequest();

    console.log(JSON.stringify({Link: resourceURL.textContent, Title: title.textContent, ImageUrl: imageURL.value, CategoryId: category.value, UserId: userID.value}));
    request.open("POST", "https://65edbc23.ngrok.io/api/posts/", true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    request.onreadystatechange = function() {//Call a function when the state changes.
        if(request.readyState == 4 && request.status == 200) {
            alert(request.responseText);
        }
    };

    request.send(JSON.stringify({Link: resourceURL.textContent, Title: title.textContent, ImageUrl: imageURL.value, CategoryId: category.value, UserId: userID.value})); //TODO: change category to id later
}
