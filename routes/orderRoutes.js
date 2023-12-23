// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Route to create a new order
router.post('/create-order', async (req, res) => {
  try {
    const { customerid, items, ordertype, estimatedTime } = req.body;

    // Add logic to validate ordertype and estimatedTime based on system rules

    const order = await Order.create({
      customerid,
      items,
      ordertype,
      orderStatus: false, // Assuming the order status is initially false
      estimatedTime,
    });

    // Add logic to update the number of in-person orders on the admin page if ordertype is 'inperson'

    res.status(200).json({ orderId: order._id, message: 'Order created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to display order status
// router.get('/display-order-status/:orderid', async (req, res) => {
//   try {
//     const { orderid } = req.params;

//     // Add logic to fetch order status based on orderId

//     res.status(200).json({ orderStatus: /* fetch order status based on orderId */ });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


  


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
  
      // Add logic to delete order based on orderId
      await Order.findByIdAndDelete(orderid);
  
      res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  


// Add more routes as needed for other operations

module.exports = router;



