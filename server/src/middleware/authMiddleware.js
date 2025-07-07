
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


const isUserLoggedIn =  (req, res, next) => {
try{

   const {token} =req.cookies;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async(err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'unauthorized access' });
        }
        const user = await User.findById(decoded.id).select('-password ');
        
        req.user = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role ? user.role : 'admin',
            adminId: user.adminId,
            credits: user.credits ? user.credits : 0,
        };
        next();
    });
    
}catch(err){
    res.status(500).json({ message: 'Internal server error', error: err.message });
}

}

module.exports = {
    isUserLoggedIn
    };