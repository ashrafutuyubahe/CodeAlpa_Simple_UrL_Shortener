
require('dotenv').config();

function retrieveShortUrl (req, res) {
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
  }

module.exports=  retrieveShortUrl;