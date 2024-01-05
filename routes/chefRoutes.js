// routes/chefRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Order = require('../models/Order');

// Route to view order details
// Route to view order details
router.get('/view-order-detail', async (req, res) => {
  try {
    const { userId, orderId } = req.query; // Assuming parameters are sent as query parameters

    // Fetch order details
    const order = await Order.findOne({ _id: orderId, chefId: userId });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Display order details
    const orderDetails = {
      customerId: order.userId,
      orderId: order._id,
      item: order.item,
      preference: order.preference,
      orderStatus: order.orderStatus,
      estimatedTime: order.estimatedTime,
    };

    res.status(200).json(orderDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to provide estimated time
router.post('/provide-estimated-time', async (req, res) => {
  try {
    const { userId, orderId, time } = req.body;

    // Update order with estimated time
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, chefId: userId },
      { estimatedTime: time },
      { new: true }
    );

    res.status(200).json({ message: 'Estimated time provided successfully', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to update order status
router.post('/update-order-status', async (req, res) => {
  try {
    const { userId, orderId, orderStatus } = req.body;

    // Update order status
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, chefId: userId },
      { orderStatus },
      { new: true }
    );

    res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add more routes as needed for other operations

module.exports = router;
