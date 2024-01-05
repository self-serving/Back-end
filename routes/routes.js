const express = require('express');
const router = express.Router();
const { adminRoute, chefRoute, customerRoute } = require("../controllers/userController");

const {
    authenticateToken,
    checkAdminRole,
    checkChefRole,
    checkCustomerRole
 } = require('../middlewares/authMiddleware');

// Route accessible only to admins
router.get("/admin", authenticateToken, checkAdminRole, adminRoute);

// Route accessible only to chefs
router.get("/chef", authenticateToken, checkChefRole, chefRoute);

// Route accessible to customer
router.get("/customer", authenticateToken, checkCustomerRole, customerRoute);


module.exports = router;