const express = require('express');
const {MongoClient, ObjectId} = require('mongodb');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const PORT = 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.set('json spaces', 3);

app.use((req, res, next) => {
    const timestamp = new Date().toISOString(); // Get the current time
    console.log(`[${timestamp}] ${req.method} ${req.url} - IP: ${req.ip}`); // Log request info

    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Request Body:', JSON.stringify(req.body, null, 2)); // Log the request body (if present)
    }

    res.on('finish', () => { // When the response is sent
        console.log(`[${new Date().toISOString()}] Response Status: ${res.statusCode}`); // Log the response status
        console.log('-'.repeat(50)); // Add a separator for readability
    });

    next(); // Move to the next middleware
});

