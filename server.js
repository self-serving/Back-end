// server.js
const express = require('express');
const dotenv = require('dotenv');



const mongoose = require('mongoose');

const dbURI = 'mongodb://localhost:27017/self-serving';

mongoose.connect('mongodb://localhost:27017/self-serving', {});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to the database');
});

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());


// Routes
const cartRoutes = require('./routes/cartRoutes');
const menuItemRoutes = require('./routes/menuItemRoutes');
const adminRoutes = require('./routes/adminRoutes');
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const chefRoutes = require('./routes/chefRoutes');

app.use('/api/cart', cartRoutes);
app.use('/api/menu', menuItemRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/chef', chefRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



