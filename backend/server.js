require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const accountRoute = require('./routes/accountRoute');
const transactionsRoute = require('./routes/transactionsRoute');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api/accounts', accountRoute);        
app.use('/api/transactions', transactionsRoute);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error('MongoDB connection error:', err));