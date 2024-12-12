// tests/bola.test.js
const request = require('supertest');
const chai = require('chai');
const jwt = require('jsonwebtoken');
const app = require('../server'); // Use require to import the app
 
const { expect } = chai;
 
require('dotenv').config();
 
const secretKey = process.env.JWT_SECRET;
 
if (!secretKey) {
    console.error("JWT_SECRET is not defined in the environment variables");
    process.exit(1);
}
 
// Helper function to generate a JWT token
const generateToken = (payload) => jwt.sign(payload, secretKey, { expiresIn: '1h' });
 
// Define mock user payloads based on base_dummy_payload.json
const alicePayload = { id: 456432, name: 'Alice Johnson', email: 'alice.johnson@example.com' };
const bobPayload = { id: 456433, name: 'Bob Smith', email: 'bob.smith@example.com' };
 
// Generate tokens
const ALICE_TOKEN = `Bearer ${generateToken(alicePayload)}`;
const BOB_TOKEN = `Bearer ${generateToken(bobPayload)}`;
const INVALID_TOKEN = 'Bearer invalid-token';
 
// Test suite for BOLA vulnerability
describe('BOLA Vulnerability Tests', () => {
    it('should allow Alice to access her own data', async () => {
        const res = await request(app)
            .get(`/users/456432`) 
            .set('Authorization', ALICE_TOKEN);
 
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('id', alicePayload.id);
        expect(res.body).to.have.property('name', alicePayload.name);
        expect(res.body).to.have.property('email', alicePayload.email);
    });
 
    it('should deny Bob from accessing Alice\'s data', async () => {
        const res = await request(app)
            .get(`/users/456432`) // Alice's ID is 1
            .set('Authorization', BOB_TOKEN);
 
        expect(res.status).to.equal(403); // Access should be denied
        expect(res.body).to.have.property('message', 'Access denied');
    });
 
    it('should deny access with no authorization', async () => {
        const res = await request(app)
            .get(`/users/456432`);
 
        expect(res.status).to.equal(401); // Unauthorized status
        expect(res.body).to.have.property('message', 'Access denied, no token provided');
    });
 
    it('should deny access with an invalid token', async () => {
        const res = await request(app)
            .get(`/users/456432`) 
            .set('Authorization', INVALID_TOKEN);
 
        expect(res.status).to.equal(400); // Invalid token status
        expect(res.body).to.have.property('message', 'Invalid token');
    });
 
    // it('should allow creating a new user', async () => {
    //     const newUser = { name: 'David Miller', email: 'david.miller@example.com' };
    //     const res = await request(app)
    //         .post('/users')
    //         .set('Authorization', ALICE_TOKEN)
    //         .send(newUser);
 
    //     expect(res.status).to.equal(201);
    //     expect(res.body).to.have.property('name', newUser.name);
    //     expect(res.body).to.have.property('email', newUser.email);
    // });
 
    it('should allow Alice to update her own details', async () => {
        const updatedData = { id: 456432, name: 'Alice Updated', email: 'alice.updated@example.com' }; 
        const res = await request(app)
            .post('/users/update')
            .set('Authorization', ALICE_TOKEN)
            .send(updatedData);
 
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('id', updatedData.id);
        expect(res.body).to.have.property('name', updatedData.name);
        expect(res.body).to.have.property('email', updatedData.email);
    });
 
    it('should deny Bob from updating Alice\'s details', async () => {
        const tamperedData = { id: 456432, name: 'Hacked Name', email: 'hacked@example.com' }; 
        const res = await request(app)
            .post('/users/update')
            .set('Authorization', BOB_TOKEN)
            .send(tamperedData);
 
        expect(res.status).to.equal(403); // Forbidden
        expect(res.body).to.have.property('message', 'Access denied');
    });
});