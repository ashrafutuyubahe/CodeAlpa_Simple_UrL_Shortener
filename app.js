const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const db = require("./models/dbconnection");
const shortid = require("short-id");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("client");
});

app.post("/postUrl", (req, res) => {
  const theUrl = req.body.theURL;
  const user_id = req.body.user_id;
  const shortId = shortid.generate();
  console.log(user_id);

  if (!user_id) {
    return res.send("you have to provide the user id");
  }

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

      res.json({ shortUrl: result[0].short, shortId: result[0].id });
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

app.get("/getUrls", (req, res) => {
  const user_id = req.query.user_id;
  console.log(user_id);

  if (!user_id) {
    return res.status(400).send("Enter the user id");
  }

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
});

app.listen(2000, () => {
  console.log("Server is running on port 2000...");
});
