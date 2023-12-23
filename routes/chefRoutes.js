// routes/chefRoutes.js
const express = require('express');
const router = express.Router();
const Chef = require('../models/Chef');
const Order = require('../models/Order');

// Route to view order details
router.post('/view-order-detail', async (req, res) => {
  try {
    const { chefId, orderId } = req.body;

    // Validate chefId (assuming it should be a unique identifier)
    const chef = await Chef.findOne({ chefId });

    if (!chef) {
      return res.status(404).json({ error: 'Chef not found' });
    }

    // Fetch order details
    const order = await Order.findOne({ _id: orderId, chefId });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Display order details
    const orderDetails = {
      customerId: order.customerId,
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
    const { chefId, orderId, time } = req.body;

    // Validate chefId (assuming it should be a unique identifier)
    const chef = await Chef.findOne({ chefId });

    if (!chef) {
      return res.status(404).json({ error: 'Chef not found' });
    }

    // Update order with estimated time
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, chefId },
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
    const { chefId, orderId, orderStatus } = req.body;

    // Validate chefId (assuming it should be a unique identifier)
    const chef = await Chef.findOne({ chefId });

    if (!chef) {
      return res.status(404).json({ error: 'Chef not found' });
    }

    // Update order status
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, chefId },
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
