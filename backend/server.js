const express = require("express");        // call express
const app = express();                 // define our app using express
const bodyParser = require("body-parser");
const sql = require("mssql");
const getPool = require("./db").getPool;

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

//let pool = getPool();

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
  getPool().then(function(pool) {
    if (!req.body.Username || !req.body.Password) return res.sendStatus(400);

    let queryString = `SELECT u.UserId, u.Username, b.Title
                      FROM dbo.[User] u, dbo.Badge b
                      INNER JOIN dbo.UserBadge ub
                      ON UserId = ub.UserId
                      WHERE u.Username = @username AND u.Password = @password`;

    let ps = new sql.PreparedStatement(pool);
    ps.input("username", sql.VarChar(50));
    ps.input("password", sql.VarChar(128));
    ps.prepare(queryString, function(err) {
      if (err) {
        console.log("couldn't prepare statement");
        return res.sendStatus(500);
      }

      let paramsObj = {
        "username": req.body.Username,
        "password": req.body.Password
      }

      ps.execute(paramsObj, function(err, result) {
        if (err) {
          console.log("encountered an error with executing query");
          return res.sendStatus(500);
        }

        ps.unprepare(function(err) {
          if (err) {
            console.log("encountered an error with unpreparing statement");
          }

          if (result.recordset.length < 1) {
            res.status(403).send({
              "Error": "No user found matching that Username/Password"
            });
          }

          return res.send({
            "UserId": result.recordset[0].UserId,
            "Username": result.recordset[0].Username,
            "BadgeName": result.recordset[0].Title
          });
        });
      });
    });
  }).catch(function(err) {
    console.log("encountered an error getting pool");
    return res.sendStatus(500);
  });
});

/*
  GET - User saved posts
  URL: https://c5102e1b.ngrok.io/api/user/saved
 */
router.get("/user/saved", function(req, res) {
  getPool().then(function(pool) {
    if (!req.query.UserId) return res.sendStatus(400);

    let queryString = `SELECT p.PostId, c.Title cTitle, p.DateCreated, p.Link, p.Title pTitle, p.ImageUrl, p.Kudos, b.Title bTitle
                       FROM dbo.SavedPost sp
                       INNER JOIN dbo.Post p
                       ON sp.PostId = p.PostId
                       INNER JOIN dbo.Category c
                       ON p.CategoryId = c.CategoryId
                       INNER JOIN dbo.[User] u
                       ON p.UserId = u.UserId
                       INNER JOIN dbo.UserBadge ub
                       ON u.UserId = ub.UserId
                       INNER JOIN dbo.Badge b
                       ON ub.BadgeId = b.BadgeId
                       WHERE sp.UserId = @userid`;

    let ps = new sql.PreparedStatement(pool);
    ps.input("userid", sql.UniqueIdentifier);
    ps.prepare(queryString, function(err) {
      if (err) {
        console.log("couldn't prepare statement");
        return res.sendStatus(500);
      }

      let paramsObj = {
        "userid": req.query.UserId
      }

      ps.execute(paramsObj, function(err, result) {
        if (err) {
          console.log("encountered an error with executing query");
          return res.sendStatus(500);
        }

        ps.unprepare(function(err) {
          if (err) {
            console.log("encountered an error with unpreparing statement");
          }
          
          if (result.recordset.length < 1) {
            res.status(403).send({
              "Error": "No saved posts found for this user"
            });
          }

          let returnObj = {};
          returnObj.Posts = [];
          result.recordset.forEach(function(record) {
            returnObj.Posts.push({
              "PostId": record.PostId,
              "PostCategory": record.cTitle,
              "DateCreated": record.DateCreated,
              "Link": record.Link,
              "Title": record.pTitle,
              "ImageUrl": record.ImageUrl,
              "Kudos": record.Kudos,
              "BadgeName": record.bTitle
            });
          });

          return res.send(returnObj);
        });
      });
    });
  }).catch(function(err) {
    console.log("encountered an error getting pool");
    return res.sendStatus(500);
  });
});

/*
  POST - Make post
  URL: https://c5102e1b.ngrok.io/api/posts
 */
router.post("/posts", function(req, res) {
  getPool().then(function(pool) {
    if (!req.body.Link ||
        !req.body.CategoryId ||
        !req.body.UserId)
    {
      return res.sendStatus(400);
    }

    let queryString = `INSERT INTO dbo.Post (Link, Title, ImageUrl, CategoryId, UserId)
                       VALUES (@link, @title, @imageurl, @categoryid, @userid)`;

    let ps = new sql.PreparedStatement(pool);
    ps.input("link", sql.NVarChar(256));
    ps.input("title", sql.VarChar(128));
    ps.input("imageurl", sql.NVarChar(256));
    ps.input("categoryid", sql.Int);
    ps.input("userid", sql.UniqueIdentifier);
    ps.prepare(queryString, function(err) {
      if (err) {
        console.log("couldn't prepare statement");
        return res.sendStatus(500);
      }

      let paramsObj = {
        "link": req.body.Link,
        "title": req.body.Title,
        "imageurl": req.body.ImageUrl,
        "categoryid": req.body.CategoryId,
        "userid": req.body.UserId
      }

      ps.execute(paramsObj, function(err, result) {
        if (err) {
          console.log("encountered an error with executing query");
          return res.sendStatus(500);
        }

        ps.unprepare(function(err) {
          if (err) {
            console.log("encountered an error with unpreparing statement");
          }

          if (result.rowsAffected.length < 1) {
            console.log("failed to add post");
            res.status(500).send({
              "Error": "failed to add post"
            });
          }
          return res.sendStatus(200);
        });
      });
    });
  }).catch(function(err) {
    console.log("encountered an error getting pool");
    return res.sendStatus(500);
  });
});

/*
  POST - Kudos
  URL: https://c5102e1b.ngrok.io/api/posts/kudos
 */
router.post("/posts/kudos", function(req, res) {
  getPool().then(function(pool) {
    if (!req.body.PostId) return res.sendStatus(400);

    let updateQueryString = `UPDATE dbo.Post
                             SET Kudos = Kudos + 1
                             WHERE PostId = @postid`;
    let selectQueryString = `SELECT Kudos
                             FROM dbo.Post
                             WHERE PostId = @postid`;
    let paramsObj = {
      "postid": req.body.PostId
    }

    let ps = new sql.PreparedStatement(pool);
    ps.input("postid", sql.UniqueIdentifier);
    ps.prepare(updateQueryString, function(err) {
      if (err) {
        console.log("couldn't prepare statement");
        return res.sendStatus(500);
      }

      ps.execute(paramsObj, function(err, result) {
        if (err) {
          console.log("encountered an error with executing query");
          return res.sendStatus(500);
        }

        ps.unprepare(function(err) {
          if (err) {
            console.log("encountered an error with unpreparing statement");
          }

          if (result.rowsAffected.length < 1) {
            console.log("failed to add kudos");
            res.status(500).send({
              "Error": "failed to add kudos"
            });
          }
          
          ps.prepare(selectQueryString, function(err) {
            if (err) {
              console.log("couldn't prepare 2nd statement");
              return res.sendStatus(500);
            }

            ps.execute(paramsObj, function(err, result) {
              if (err) {
                console.log("encountered an error with executing 2nd query");
                return res.sendStatus(500);
              }

              ps.unprepare(function(err) {
                if (err) {
                  console.log("encountered an error with unpreparing 2nd statement");
                }

                if (result.recordset.length < 1) {
                  res.status(403).send({
                    "Error": "could not find the post we just added to..."
                  });
                }

                return res.send({
                  "Kudos": result.recordset[0].Kudos
                });
              })
            });
          });
        });
      });
    });
  });
});

/*
  GET - Get posts
  URL: https://c5102e1b.ngrok.io/api/posts
 */
router.get("/posts", function(req, res) {
  getPool().then(function(pool) {
    let queryString = `SELECT p.PostId, c.Title cTitle, p.DateCreated, p.Link, p.Title pTitle, p.ImageUrl, p.Kudos, b.Title bTitle
                       FROM dbo.Post p
                       INNER JOIN dbo.Category c
                       ON p.CategoryId = c.CategoryId
                       INNER JOIN dbo.[User] u
                       ON p.UserId = u.UserId
                       INNER JOIN dbo.UserBadge ub
                       ON u.UserId = ub.UserId
                       INNER JOIN dbo.Badge b
                       ON ub.BadgeId = b.BadgeId`;

    let request = new sql.Request(pool);
    request.query(queryString, function(err, result) {
      if (err) {
        console.log("encountered an error with executing query");
        return res.status(500).send({
          "Error": "encountered and error with executing query"
        });
      }

      if (result.recordset.length < 1) {
        res.status(403).send({
          "Error": "No posts found"
        });
      }

      let returnObj = {};
      returnObj.Posts = [];
      result.recordset.forEach(function(record) {
        returnObj.Posts.push({
          "PostId": record.PostId,
          "PostCategory": record.cTitle,
          "DateCreated": record.DateCreated,
          "Link": record.Link,
          "Title": record.pTitle,
          "ImageUrl": record.ImageUrl,
          "Kudos": record.Kudos,
          "BadgeName": record.bTitle
        });
      });

      return res.send(returnObj);
    });
  }).catch(function(err) {
    console.log("encountered an error getting pool");
    return res.sendStatus(500);
  });
});

app.use("/api", router);

app.listen(port);

console.log("Server running on port: " + port);
