// models/System.js
const mongoose = require('mongoose');

const systemSchema = new mongoose.Schema({
  systemStatus: {
    type: Boolean,
    required: true,
    default: true, // Default to true, you can change it based on your needs
  },
});

const System = mongoose.model('System', systemSchema);

module.exports = System;
