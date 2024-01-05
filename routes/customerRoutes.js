// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Bank = require('../models/Bank');



// Route to choose in-person or takeaway, select preferences, and create an order
router.post('/choose-options', async (req, res) => {
  try {
    const { userId, orderType, items } = req.body;
    // Implement logic to create a new order with default status 'Pending'
    const order = new Order({ userId, items, orderType, status: 'Pending' });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to pay for the order using the bank system
router.post('/pay', async (req, res) => {
  try {
    const { userId, accountNumber, totalPrice } = req.body;
    // Implement logic to check if the user has sufficient balance in their bank account
    const bank = await Bank.findOne({ userId, accountNumber });
    if (!bank || bank.amount < totalPrice) {
      res.status(400).json({ error: 'Insufficient funds' });
    } else {
      // Deduct the amount from the user's bank account
      await Bank.updateOne({ userId, accountNumber }, { $inc: { amount: -totalPrice } });
      // Update the order status to 'Paid'
      await Order.updateOne({ userId, orderStatus: false }, { orderStatus: true });
      res.status(200).json({ message: 'Payment successful' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports =router;