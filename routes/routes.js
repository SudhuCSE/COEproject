const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { 
    getUserById, 
    updateUser, 
    deleteUser 
} = require('../controllers/userController');
const generateToken = require('../generatetoken.js'); // Import the token generation logic

const router = express.Router();

// Base route
router.get('/', (req, res) => {
    res.send('Welcome to the BOLA API!');
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({ status: 'UP' });
});

// Greet endpoint
router.get('/greet', (req, res) => {
    res.send('Welcome to the BOLA API!');
});

// User retrieval endpoint (vulnerable to BOLA)
router.get('/users/:id', verifyToken, getUserById);

// Update user endpoint
router.post('/users/update', verifyToken, updateUser);

// Delete user endpoint
router.delete('/users/:id', verifyToken, deleteUser);

// Token generation endpoint
router.post('/generate-token', (req, res) => {
    try {
        const { userId } = req.body; // Accept user ID in the request payload
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required to generate a token.' });
        }

        const token = generateToken(userId); // Use the generateToken logic
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error generating token:', error.message);
        res.status(500).json({ error: 'Failed to generate token.' });
    }
});

module.exports = router;
