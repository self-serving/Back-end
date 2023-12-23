// models/Customer.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  userId: { type: Number, unique: true, required: true },
  email: { type: String, required: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  password: { type: String, required: true, minlength: 8 },
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
