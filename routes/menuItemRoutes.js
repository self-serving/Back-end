// routes/menuItemRoutes.js
const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// Route to add a menu item
router.post('/add', async (req, res) => {
  try {
    const { menuItemId, price, description, preference } = req.body;
    const menuItem = new MenuItem({ menuItemId, price, description, preference });
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get all menu items
router.get('/all', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add more routes as needed for other operations

module.exports = router;
