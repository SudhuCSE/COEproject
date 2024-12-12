const fs = require('fs');
const path = require('path');

// Load dummy payload data
const payloadData = JSON.parse(fs.readFileSync(path.join(__dirname, '../payload/base_dummy_payload.json'), 'utf8'));

// Get user by ID (this is where BOLA vulnerability will appear)
exports.getUserById = (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ message: 'Invalid ID: ID must be a valid number.' });
    }

    // A vulnerable endpoint where token isn't validated against user ID
    const user = payloadData.find(user => user.id === parseInt(id));

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// Create a new user
// exports.createUser = (req, res) => {
//     const { name, email } = req.body;

//     if (!name || typeof name !== 'string' || !email || typeof email !== 'string') {
//         return res.status(400).json({ message: 'Invalid input: name and email are required and must be strings.' });
//     }

//     const newUser = { id: payloadData.length + 1, name, email };
//     payloadData.push(newUser);

//     res.status(201).json(newUser);
// };

// Update user details (partial update)
exports.updateUser = (req, res) => {
    const { id, name, email } = req.body;

    if (!id || typeof id !== 'number') {
        return res.status(400).json({ message: 'Invalid input: id must be a valid number.' });
    }

    if (name && typeof name !== 'string') {
        return res.status(400).json({ message: 'Invalid input: name must be a string if provided.' });
    }

    if (email && typeof email !== 'string') {
        return res.status(400).json({ message: 'Invalid input: email must be a string if provided.' });
    }

    const userIndex = payloadData.findIndex(user => user.id === parseInt(id));
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Update only the fields provided in the request body
    const updatedUser = {
        ...payloadData[userIndex],
        ...(name && { name }),
        ...(email && { email }),
    };

    payloadData[userIndex] = updatedUser;
    res.status(200).json(updatedUser);
};


// // Replace user details (full update)
// exports.replaceUser = (req, res) => {
//     const { id } = req.params;
//     const { name, email } = req.body;

//     if (!id || isNaN(parseInt(id)) || !name || typeof name !== 'string' || !email || typeof email !== 'string') {
//         return res.status(400).json({ message: 'Invalid input: id must be a valid number, and name and email are required and must be strings.' });
//     }

//     const userIndex = payloadData.findIndex(user => user.id === parseInt(id));
//     if (userIndex === -1) {
//         return res.status(404).json({ message: 'User not found' });
//     }

//     payloadData[userIndex] = { id: parseInt(id), name, email };
//     res.status(200).json(payloadData[userIndex]);
// };

// Delete a user
exports.deleteUser = (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ message: 'Invalid input: id must be a valid number.' });
    }

    const userIndex = payloadData.findIndex(user => user.id === parseInt(id));
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    payloadData.splice(userIndex, 1);
    res.status(200).json({ message: 'User deleted successfully' });
};
