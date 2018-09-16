
// Add kudos rating to links on Google search
if (document.title.indexOf("Google") != -1) {
    var request = new XMLHttpRequest();
    request.open("GET", "https://c5102e1b.ngrok.io/api/posts", true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.onreadystatechange = function() {
        if(request.readyState == 4 && request.status == 200) {

            var posts = JSON.parse(request.responseText).Posts;
            var postUrls = [];
            // hack an array of postUrls
            for(var i in posts) {
                postUrls.push(posts[i].Link);
            }

            var searchElements = document.getElementById("search");

            var elements = document.querySelectorAll('h3');

            [].forEach.call(elements, function(h3) {
                var link = h3.children[0] ? h3.children[0].href : "" ;
                if(postUrls.includes(link)) {
                    var newDiv = document.createElement('div');
                    newDiv.className = "searchFlag";
                    newDiv.innerHTML = `<div style="font-size: 8px; text-transform: uppercase; letter-spacing: 1px; cursor: pointer;
                        color: white; border-radius: 15px; width: 100px; background-color: #00A388; padding: 2px 3px 2px 6px;">+Kudos from ShareIt</div>`;

                    h3.appendChild(newDiv);
                }
            });
        }
    };

    request.send();

}
