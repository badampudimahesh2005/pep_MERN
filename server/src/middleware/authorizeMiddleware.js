const permissions = require('../constants/permissions');

const authorize = (requiredPermission) => {
    return (req, res, next) => {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: No user found' });
        }

       const hasPermission = permissions[user.role] || [];
       if (hasPermission.includes(requiredPermission)) {
           return next();
       } else {
           return res.status(403).json({ message: 'Forbidden: Insufficient permissions', requiredPermission });
       }
    };
};

module.exports = authorize;