// models/Chef.js
const mongoose = require('mongoose');

const chefSchema = new mongoose.Schema({
  chefId: { type: Number, unique: true, required: true },
  chefEmail: { type: String, unique: true, required: true, match: /^\S+@\S+\.\S+$/ },
  chefPassword: { type: String, required: true, minlength: 6 },
});

const Chef = mongoose.model('Chef', chefSchema);

module.exports = Chef;
