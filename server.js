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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Ensure your HTML file is named `index.html` and is in the same directory
});

const uri = "mongodb+srv://ks1751:Olaoluwa88@cluster0.kyiza.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your MongoDB Atlas URI
const client = new MongoClient(uri);
let db;
  
client
    .connect()
    .then(() => {
      db = client.db('Database1');
      console.log('Connected to MongoDB Atlas');
    })
    .catch((err) => console.error('MongoDB Connection Error:', err)
);

app.get('/api/lessons', async (req, res) => {
    try {
      const lessons = await db.collection('Lessons').find().toArray();
      res.json(lessons);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch lessons' });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const orderData = {
            customerName: req.body.name,
            contactNumber: req.body.phoneNumber,
            lessons: req.body.lessonIds.map(lessonId => new ObjectId(id)),
            Spaces: req.body.spaces,
        };

        const dbResult = await db.collection('Orders').insertOne(orderData);
        res.status(201).json({ ...orderData, _id: dbResult.insertedId });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});