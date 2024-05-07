const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const db = require("./models/dbconnection");
const shortid = require("short-id");
const jwt= require('jsonwebtoken');

const swaggerjdc= require('swagger-jsdoc');
const swagger_ui= require('swagger-ui-express');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("client");
});

///swagger documentation
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Url shrtener",
      version: "1.0.0",
      description: "API documentation for the for Url Shortner application",
    },
    servers: [
      {
        url: "http://localhost:2000", 
      },
    ],
  },
  apis: ["./app.js"], 
};

const swaggerSpec = swaggerjdc(options);

app.use("/api/doc", swagger_ui.serve, swagger_ui.setup(swaggerSpec));





function authenticateUser(req, res, next) {
  const secretKey = 'privatekey';
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  const newUser_id = req.query.user_id; 
   
  if (!token) {
      return res.status(401).send('Token is missing. Please provide a valid token.');
  }

  jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
          if (err.name === 'TokenExpiredError') {
              if (newUser_id) {

                res.locals.newUser_id = newUser_id
                 return;
                 

              }
              return res.status(401).send('Token has expired. Please provide a new token.');
           } else {
              return res.status(401).send('Invalid token: ' + err.message); // Sending the error message as a string
          }
      }

      req.user = decoded;
      next();
  });
}


const secretKey='privatekey';
/**
 * @swagger
 * /postUrl:
 *   get:
 *     summary: This API is used for URL storage
 *     description: This API stores the URL entered by the user to the database
 *     responses:
 *       200:
 *         description: To test the URL post method
 */

app.post("/postUrl", (req, res) => {
  const theUrl = req.body.theURL;
  const user_id = req.body.user_id;
  const shortId = shortid.generate();
  console.log(user_id);

  const expiresInDuration = 2 * 60
  const token= jwt.sign({user_id:user_id},secretKey,{expiresIn:expiresInDuration});


  

  const insertQuery = "INSERT INTO Urls (full, short,user_id) VALUES (?, ?,?)";
  db.query(insertQuery, [theUrl, shortId, user_id], (error, result) => {
    if (error) {
      console.error("Error inserting URL:", error);
      return res.status(500).send("Error inserting URL");
    }

    const selectQuery = "SELECT short, id  FROM Urls WHERE full = ?";
    db.query(selectQuery, [theUrl], (error, result) => {
      if (error) {
        console.error("Error retrieving short ID:", error);
        return res.status(500).send("Error retrieving short ID");
      }

      if (result.length === 0) {
        return res.status(404).send("Short ID not found");
      }
     console.log(token);
      res.json({ token,shortUrl: result[0].short, shortId: result[0].id });
    });
  });
});

app.get("/urlClicked", (req, res) => {
  const shortId = req.query.id;
  console.log(shortId);

  const findQuery = "SELECT full FROM Urls WHERE id = ?";
  db.query(findQuery, [shortId], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Failed to retrieve the URL");
    }

    if (result.length === 0) {
      return res.status(404).send("URL not found");
    }

    const fullUrl = result[0].full;
    res.send(fullUrl);
  });
});

app.get("/getUrls", authenticateUser, (req, res) => {
  const user_id = req.user.user_id;
  const newUser_id = res.locals.newUser_id; 
  console.log(newUser_id);

  
  if (!user_id) {
      const newUser_id = req.user_id;     
   console.log(newUser_id);
      
      const findUrls = "SELECT full, short FROM urls WHERE user_id = ?";
      db.query(findUrls, [newUser_id], (error, result) => {
          if (error) {
              console.error(error);
              return res.status(500).send("Error retrieving URLs");
          }

          const urls = result.map((row) => {
              return {
                  full: row.full,
                  short: row.short,
              };
          });

          res.json(urls);
      });
  } else {
      
      const findUrls = "SELECT full, short FROM urls WHERE user_id = ?";
      db.query(findUrls, [user_id], (error, result) => {
          if (error) {
              console.error(error);
              return res.status(500).send("Error retrieving URLs");
          }

          const urls = result.map((row) => {
              return {
                  full: row.full,
                  short: row.short,
              };
          });

          res.json(urls);
      });
  }
});

app.listen(2000, () => {
  console.log("Server is running on port 2000...");
});
