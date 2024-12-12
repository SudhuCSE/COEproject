// routes.js
const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { 
    getUserById, 
   // createUser, 
    updateUser, 
    deleteUser, 
    //replaceUser 
} = require('../controllers/userController');

const router = express.Router();

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

// Create user endpoint
// router.post('/users', verifyToken, createUser);

// Update user endpoint
router.post('/users/update', verifyToken, updateUser); 

// Replace user endpoint (full update)
// router.put('/users/:id', verifyToken, replaceUser);

// Delete user endpoint
router.delete('/users/:id', verifyToken, deleteUser);

const app = express();
app.use(router);

module.exports = app; 
