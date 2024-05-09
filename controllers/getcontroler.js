
require('dotenv').config();
 
 function authenticateUser(req, res){
    const user_id = req.user.user_id;
    const newUser_id = res.locals.newUser_id; 
    console.log(newUser_id);
    console.log(user_id)
  
    
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
  }

  module.exports= authenticateUser;