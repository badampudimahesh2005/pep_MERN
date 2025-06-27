
const jwt = require('jsonwebtoken');


const isUserLoggedIn = (req, res, next) => {
try{

   const {token} =req.cookies;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'unauthorized access' });
        }
        req.user = decoded; 
        next(); 
    });
    
}catch(err){
    res.status(500).json({ message: 'Internal server error', error: err.message });
}

}

module.exports = {
    isUserLoggedIn
    };