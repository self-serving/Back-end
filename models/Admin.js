// models/Admin.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  adminId: { type: Number, unique: true, required: true },
  adminEmail: { type: String, required: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  adminPassword: { type: String, required: true, minlength: 8 },
  systemStatus: { type: Boolean, required: true },
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
