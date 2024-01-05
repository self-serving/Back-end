// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const Ingredient = require('../models/Ingredient');
const system = require('../models/System');
const multer = require('multer');
const MenuItem = require('../models/MenuItem');


const jwt = require('jsonwebtoken');
const User = require('../models/User');




// Route to manage system status
router.post('/manage-system', async (req, res) => {
  try {
    const { systemStatus } = req.body;

    // Check if the provided status is valid (true or false)
    if (typeof systemStatus !== 'boolean') {
      return res.status(400).json({ error: 'Invalid system status value' });
    }

    // Update the system status using the System model
    await System.findOneAndUpdate({}, { $set: { systemStatus } }, { upsert: true });

    res.status(200).json({ message: `System ${systemStatus ? 'enabled' : 'disabled'} successfully` });
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
router.get('/ingredients', async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to add a new menu item


const upload = multer();

router.post('/add-menu-item', upload.single('photo'), async (req, res) => {
  try {
    const { menuItemId, price, description, preference } = req.body;
    const photoBase64 = req.file.buffer.toString('base64');

    const menuItem = new MenuItem({
      menuItemId,
      price,
      photo: photoBase64,
      description,
      preference,
    });

    await menuItem.save();
    res.status(201).json({ message: 'Menu item created successfully' });
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
    const { name, price, description, selectedIngredients } = req.body;

    // Check if the selected ingredients provided exist in the database
    const validIngredients = await Ingredient.find({ _id: { $in: selectedIngredients } });

    // If some of the selected ingredients are not valid, return a 400 Bad Request response
    if (validIngredients.length !== selectedIngredients.length) {
      return res.status(400).json({ error: 'Invalid ingredients provided' });
    }

    // Update the menu item with the provided information and valid ingredients
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      itemId,
      { name, price, description, ingredients: validIngredients },
      { new: true }
    );

    // If the menu item with the specified ID is not found, return a 404 Not Found response
    if (!updatedMenuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    // Return a 200 OK response with the details of the updated menu item
    res.status(200).json(updatedMenuItem);
  } catch (error) {
    // If an error occurs during the process, return a 500 Internal Server Error response
    res.status(500).json({ error: error.message });
  }
});




module.exports = router;
