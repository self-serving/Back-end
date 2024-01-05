// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');
const Ingredient = require('../models/Ingredient');

// Route to add an item to the cart
router.post('/add-to-cart', async (req, res) => {
  try {
    const { userId, itemId, quantity, ingredientPreference } = req.body;

    // Fetch the user, item, and ingredients from the database
    const user = await User.findById(userId);
    const item = await MenuItem.findById(itemId);
    const ingredients = await Ingredient.find({ _id: { $in: ingredientPreference } });

    // Create a new item for the cart
    const cartItem = {
      itemId: item,
      quantity,
      ingredient_preference: ingredients,
    };

    // Find the user's cart 
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    // Update the cart with the new item
    cart.items.push(cartItem);
    await cart.save();

    res.status(200).json({ message: 'Item added to the cart successfully', cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to view the user's cart
router.get('/view-cart/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the user's cart
    const cart = await Cart.findOne({ userId }).populate('items.itemId');

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to remove an item from the cart
router.delete('/remove-item/:userId/:itemId', async (req, res) => {
  try {
    const { userId, itemId } = req.params;

    // Find the user's cart and remove the item
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { itemId } } },
      { new: true }
    ).populate('items.itemId');

    res.status(200).json({ message: 'Item removed from the cart successfully', cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add more routes as needed for other operations

module.exports = router;
