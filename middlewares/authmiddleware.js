

   function authenticateUser(req, res, next) {
    
    const secretKey='privatekey';
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        req.user = decoded;
        next();
    });
}