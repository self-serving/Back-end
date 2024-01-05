
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId, unique: true },
  customerid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ type: String, required: true, validate: [arrayMinLengthValidator, 'Order must have at least one item'] }],
  ordertype: { type: String, required: true, enum: ['inperson', 'delivery'], validate: [orderTypeValidator, 'Invalid order type'] },
  orderStatus: { type: Boolean, required: true },
  estimatedTime: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

function arrayMinLengthValidator(val) {
  return val.length > 0;
}

function orderTypeValidator(val) {
  return val === 'inperson' || val === 'delivery';
}

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
