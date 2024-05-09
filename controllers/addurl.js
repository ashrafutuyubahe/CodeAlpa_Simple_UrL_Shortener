const shortid = require("short-id");
const jwt = require("jsonwebtoken");
const secretKey = "privatekey";
const db = require("../models/dbconnection");
require('dotenv').config();



function addUrl(req, res) {
  const theUrl = req.body.theURL;
  const user_id = req.body.user_id;
  const shortId = shortid.generate();
  console.log(user_id);

  const expiresInDuration = 2 * 60;
  const token = jwt.sign({ user_id: user_id }, secretKey, {
    expiresIn: expiresInDuration,
  });

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
      res.json({ token, shortUrl: result[0].short, shortId: result[0].id });
    });
  });
}

module.exports = addUrl;
