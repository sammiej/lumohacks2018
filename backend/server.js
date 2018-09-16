const express = require("express");        // call express
const app = express();                 // define our app using express
const bodyParser = require("body-parser");
const mssql = require("mssql");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;      
const router = express.Router();              

router.get("/", function(req, res) {
  res.json({
    message: "welcome to the ncs-backend"
  });   
});

// more routes for our API will happen here
// Get posts
router.get("/posts", function(req, res) {
  res.json({
    message: "reached post endpoint"
  })
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use("/api", router);

app.listen(port);
console.log("Server running on port: " + port);
