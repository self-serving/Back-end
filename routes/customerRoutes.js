// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Bank = require('../models/Bank');

// Route for customer registration
router.post('/register', async (req, res) => {
  try {
    const { userId, email, password } = req.body;
    const customer = new Customer({ userId, email, password });
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for customer login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email, password });
    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
    } else {
      res.status(200).json(customer);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to add items to the cart
router.post('/add-to-cart', async (req, res) => {
  try {
    // Implement logic to add items to the cart
    // Example: Get userId from the request and update the user's cart
    // You'll need a Cart model and a User model with a cart field
    res.status(200).json({ message: 'Item added to the cart successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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