const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userController = {
  adminRoute: async (req, res) => {
    try {
      const users = await User.find({ role: "admin" });
      res.json({ message: "Admin route", users });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  chefRoute: async (req, res) => {
    try {
      const users = await User.find({ role: "chef" });
      res.json({ message: "Chef route", users });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  customerRoute: async (req, res) => {
    try {
      const users = await User.find({ role: "customer"});
      res.json({ message: "Customer route", users });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

 
};

module.exports = userController;