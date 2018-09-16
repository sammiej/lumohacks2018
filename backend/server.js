const express = require("express");        // call express
const app = express();                 // define our app using express
const bodyParser = require("body-parser");
const mssql = require("mssql");
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;      
const router = express.Router();              

router.get("/", function(req, res) {
  res.json({
    message: "welcome to the ncs-backend"
  });   
});

/*
  POST - User “”””authentication””””
  URL: https://c5102e1b.ngrok.io/api/user/auth
  body: {
    username: ,
    password:  ,
  }

  response: {
    userid: ,
    name: ,
    badge:  ,
    isverified: 
  }
 */
router.post("/user/auth", function(req, res) {
  if (!req.body) return res.sendStatus(400);
  //stub
  return res.sendStatus(200);
});

/*
  GET - User saved posts
  URL: https://c5102e1b.ngrok.io/api/user/saved
  params : {
    userid: ,
    limit: (number of posts returned),
    offset: (multiples of limit to skip)
  }

  response: {
    posts: [
      {
        postid: ,
        link: ,
        imageurl: ,
        upvotecounter: ,
        name: ,
        badge: 
      }
    ]
  }
 */
router.get("/user/saved", function(req, res) {
  //stub
  return res.sendStatus(200);
});

/*
  POST - Make post
  URL: https://c5102e1b.ngrok.io/api/posts
  body: {
    body: {
    link: ,
    imageurl: ,
    categoryid: ,
    userid:   
  }

  }

  response : {
    postid: ,
    link: ,
    imageurl: ,
    upvotecounter: ,
    name: ,
    badge:
  }
 */
router.post("/posts", function(req, res) {
  if (!req.body) return res.sendStatus(400)
  //stub
  return res.sendStatus(200);
});

/*
  POST - Upvote
  URL: https://c5102e1b.ngrok.io/api/posts/upvote
  body: {
    postid:
  }

  response: {
    upvotecounter: 
  }
 */
router.post("/posts/upvote", function(req, res) {
  if (!req.body) return res.sendStatus(400)
  //stub
  return res.sendStatus(200);
});

/*
  GET - Get posts
  URL: https://c5102e1b.ngrok.io/api/posts
  params: {
    categoryid: (null for all),
    limit: (number of posts returned),
    offset: (multiples of limit to skip)
  }

  response : {
    posts: [ // array of post objects
      {
        postid: ,
        link: ,
        imageurl: ,
        upvotecounter: ,
        name: ,
        badge: 
      }
    ]
  }
 */
router.get("/posts", function(req, res) {
  //stub
  return res.sendStatus(200);
});

app.use("/api", router);


app.listen(port);
console.log("Server running on port: " + port);
