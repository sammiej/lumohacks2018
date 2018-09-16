const express = require("express");        // call express
const app = express();                 // define our app using express
const bodyParser = require("body-parser");
const getPool = require("./db").getPool;
const mssql = require("mssql");

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const port = process.env.PORT || 3000;
const router = express.Router();

let pool = getPool();

router.get("/", function(req, res) {
  res.json({
    message: "ncs-backend"
  });   
});

/*
  POST - User “”””authentication””””
  URL: https://c5102e1b.ngrok.io/api/user/auth
 */
router.post("/user/auth", function(req, res) {
  if (!req.body) return res.sendStatus(400);
  //stub
  let sampleResObj = {
    "UserId": "da8ea5b4-f675-4192-8f92-7ab3645aafce",
    "UserName": "nickc95",
    "BadgeName": "RoboCop"
  }
  return res.send(sampleResObj);
});

/*
  GET - User saved posts
  URL: https://c5102e1b.ngrok.io/api/user/saved
 */
router.get("/user/saved", function(req, res) {
  //stub
  let sampleResObj = {
    "posts": [
      {
        "PostId": "61ccbf82-4061-48b9-be7b-bf1e7f84bc07",
        "Link": "https://www.theglobeandmail.com/opinion/article-how-many-people-actually-suffer-from-mental-illness/",
        "Title": "How many people actually suffer from mental illness?",
        "ImageUrl": null,
        "Kudos": 43,
        "BadgeName": "RoboCop"
      }
    ]
  }
  return res.send(sampleResObj);
});

/*
  POST - Make post
  URL: https://c5102e1b.ngrok.io/api/posts
 */
router.post("/posts", function(req, res) {
  if (!req.body) return res.sendStatus(400)
  //stub
  let sampleResObj = {
    "PostId": "61ccbf82-4061-48b9-be7b-bf1e7f84bc07",
    "Link": "https://www.theglobeandmail.com/opinion/article-how-many-people-actually-suffer-from-mental-illness/",
    "Title": "How many people actually suffer from mental illness?",
    "ImageUrl": null,
    "Kudos": 43,
    "BadgeName": "RoboCop"
  }
  return res.send(sampleResObj);
});

/*
  POST - Kudos
  URL: https://c5102e1b.ngrok.io/api/posts/kudos
 */
router.post("/posts/upvote", function(req, res) {
  if (!req.body) return res.sendStatus(400)
  //stub
  let sampleResObj = {
    "kudos": 43
  }
  return res.sendStatus(200);
});

/*
  GET - Get posts
  URL: https://c5102e1b.ngrok.io/api/posts
 */
router.get("/posts", function(req, res) {
  //stub
  let sampleResObj = {
    "posts": [
      {
        "PostId": "61ccbf82-4061-48b9-be7b-bf1e7f84bc07",
        "Link": "https://www.theglobeandmail.com/opinion/article-how-many-people-actually-suffer-from-mental-illness/",
        "Title": "How many people actually suffer from mental illness?",
        "ImageUrl": null,
        "Kudos": 43,
        "BadgeName": "RoboCop"
      }
    ]
  }
  return res.send(sampleResObj);
});

app.use("/api", router);


app.listen(port);

console.log("Server running on port: " + port);
