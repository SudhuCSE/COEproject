const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); 

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

// Replace with the user ID you want to generate a token for
const userId = 456432; // Example: Change to the ID you want
const userPayload = payloadData.find(user => user.id === userId);

if (!userPayload) {
    console.error(`User with ID ${userId} not found in the payload file.`);
    process.exit(1);
}

// Generate the token
const token = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: "1h" });

console.log("Generated JWT Token:", token);
