

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
                return res.status(401).send('Token has expired. Please provide a new token by entering your id again.');
             } else {
                return res.status(401).send('Invalid token: ' + err.message); 
            }
        }
  
        req.user = decoded;
        next();
    });
  }
  