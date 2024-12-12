const jwt = require('jsonwebtoken');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const secretKey = process.env.JWT_SECRET;

if (!secretKey) {
    console.error("JWT_SECRET is not defined in the environment variables");
    process.exit(1); 
}

// Load the payload from the JSON file
const payloadFilePath = path.join(__dirname, "payload/base_dummy_payload.json");
let payloadData;

// Read the JSON file
try {
    payloadData = JSON.parse(fs.readFileSync(payloadFilePath, "utf8"));
} catch (err) {
    console.error("Error reading the JSON file:", err.message);
    process.exit(1);
}

/**
 * Generates a JWT token for a given user ID.
 * @param {number} userId - The user ID for which to generate a token.
 * @returns {string} - The generated JWT token.
 */
const generateToken = (userId) => {
    const userPayload = payloadData.find(user => user.id === userId);
    if (!userPayload) {
        throw new Error(`User with ID ${userId} not found in the payload file.`);
    }
    return jwt.sign(userPayload, secretKey, { expiresIn: '1h' });
};

module.exports = generateToken;
