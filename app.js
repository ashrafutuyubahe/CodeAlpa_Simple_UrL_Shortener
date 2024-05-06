const express = require("express");
const app = express();
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const db = require('./models/dbconnection');
const shortid = require('short-id');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get('/', (req, res) => {
    res.render('client');
});

app.post('/postUrl', (req, res) => {
    const theUrl = req.body.theURL;
    const shortId = shortid.generate();

    const insertQuery = "INSERT INTO Urls (full, short) VALUES (?, ?)";
    db.query(insertQuery, [theUrl, shortId], (error, result) => {
        if (error) {
            console.error('Error inserting URL:', error);
            return res.status(500).send('Error inserting URL');
        }

       
        const selectQuery = "SELECT short FROM Urls WHERE full = ?";
        db.query(selectQuery, [theUrl], (error, result) => {
            if (error) {
                console.error('Error retrieving short ID:', error);
                return res.status(500).send('Error retrieving short ID');
            }

            if (result.length === 0) {
                return res.status(404).send('Short ID not found');
            }
      
            
            res.json({ shortUrl: result[0].short, shortId: result[0].id });
        
        });
    });
});

app.get('/urlClicked', (req, res) => {
    const shortId = req.params.id;

    const findQuery = "SELECT full FROM Urls WHERE id = ?";
    db.query(findQuery, [shortId], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Failed to retrieve the URL');
        }
        
        if (result.length === 0) {
            return res.status(404).send('URL not found');
        }

        const fullUrl = result[0].full;
        res.redirect(fullUrl);
    });
});




app.listen(2000, () => {
    console.log("Server is running on port 2000...");
});
