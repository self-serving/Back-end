const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accountNumber: { type: String, required: true },
  amount: { type: Number, required: true },
});

const Bank = mongoose.model('Bank', bankSchema);

module.exports = Bank;
