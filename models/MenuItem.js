const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  menuItemId: { type: Number, unique: true, required: true },
  price: { type: Number, required: true, min: 0 },
  photo: { type: String, required: true }, // Store the image as a Base64 string
  description: { type: String },
  preference: { type: [Boolean] },
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
