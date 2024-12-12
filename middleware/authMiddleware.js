const jwt = require('jsonwebtoken');
require('dotenv').config(); 

const secretKey = process.env.JWT_SECRET;

if (!secretKey) {
    console.error("JWT_SECRET is not defined in the environment variables");
    process.exit(1); 
}

exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from Bearer

    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add decoded user info to request
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token' });
    }
};
