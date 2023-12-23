// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const MenuItem = require('../models/MenuItem');

// Route for admin login
router.post('/login', async (req, res) => {
  try {
    const { adminEmail, adminPassword } = req.body;
    const admin = await Admin.findOne({ adminEmail, adminPassword });
    if (!admin) {
      res.status(404).json({ error: 'Admin not found' });
    } else {
      res.status(200).json(admin);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to manage system status
router.post('/manage-system', async (req, res) => {
  try {
    const { systemStatus } = req.body;
    await Admin.updateOne({}, { systemStatus });
    res.status(200).json({ message: 'System status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to display number of in-person orders
router.get('/display-non-inperson-orders', async (req, res) => {
  try {
    const inPersonOrders = await Order.countDocuments({ orderType: false });
    res.status(200).json({ inPersonOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to add a new menu item
router.post('/add-menu-item', async (req, res) => {
  try {
    const { name, price, description, preference } = req.body;
    const menuItem = new MenuItem({ name, price, description, preference });
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to delete a menu item
router.delete('/delete-menu-item/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    await MenuItem.deleteOne({ _id: itemId });
    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to edit a menu item
router.put('/edit-menu-item/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const { name, price, description, preference } = req.body;
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      itemId,
      { name, price, description, preference },
      { new: true }
    );
    res.status(200).json(updatedMenuItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add more routes as needed for other operations

module.exports = router;
