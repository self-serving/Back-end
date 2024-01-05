// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { inPersonOrderCount } = require('./config/const');

// Route to create a new order
router.post('/create-order', async (req, res) => {
  try {
    const { customerid, items, ordertype, estimatedTime } = req.body;

    const order = await Order.create({
      customerid,
      items,
      ordertype,
      orderStatus: "pending", // Assuming the order status is initially false
      estimatedTime,
    });

    if (ordertype === 'inperson') {
    inPersonOrderCount++
    }
    

    res.status(200).json({ orderId: order._id, message: 'Order created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put('/mark-delivered/:orderid', async (req, res) => {
    try {
      const { orderid } = req.params;
  
      // Add logic to update order status to 'delivered' based on orderId
      await Order.findByIdAndUpdate(orderid, { orderStatus: 'delivered' });
  
      res.status(200).json({ message: 'Order marked as delivered successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Route to delete order when user accepts
  router.delete('/delete-order/:orderid', async (req, res) => {
    try {
      const { orderid } = req.params;
  
      // Find the order to get its ordertype
      const order = await Order.findById(orderid);
  
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      // Check if the ordertype is 'inperson'
      if (order.ordertype === 'inperson') {
        // Subtract from inPersonOrderCount
        if (inPersonOrderCount > 0) {
          inPersonOrderCount -= 1;
        }
      }
  
      // Delete the order based on orderId
      await Order.findByIdAndDelete(orderid);
  
      res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  


module.exports = router;



