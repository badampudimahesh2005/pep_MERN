
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


const isUserLoggedIn =  (req, res, next) => {
try{

   const {token} =req.cookies;

    if (!token) {
        return res.status(401).json({ 
            message: 'Unauthorized access',
            tokenExpired: true 
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, async(err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    message: 'Token expired',
                    tokenExpired: true 
                });
            }
            return res.status(403).json({ 
                message: 'Unauthorized access',
                tokenExpired: true 
            });
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



const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token not provided' });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userDetails = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role ? user.role : 'admin',
            adminId: user.adminId,
            credits: user.credits ? user.credits : 0,
            subscription: user.subscription ? user.subscription : null,
        };

        const newAccessToken = jwt.sign(userDetails, process.env.JWT_SECRET, { expiresIn: '1m' });

        res.cookie('token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            domain: 'localhost',
        });

        res.status(200).json({ 
            message: 'Token refreshed successfully', 
            userDetails: userDetails 
        });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Refresh token expired' });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
        return res.status(403).json({ message: 'Unauthorized access' });
    }
}

module.exports = {
    isUserLoggedIn,
    refreshToken
};