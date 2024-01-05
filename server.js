const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
dotenv.config();
let inPersonOrderCount = 0;
// 
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI);

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

db.once("open", () => {
  console.log("Connected to MongoDB Atlas");
});

// Your other routes and middleware can be defined here



// Routes
const cartRoutes = require("./routes/cartRoutes");
const menuItemRoutes = require("./routes/menuItemRoutes");
const adminRoutes = require("./routes/adminRoutes");
const customerRoutes = require("./routes/customerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const chefRoutes = require("./routes/chefRoutes");
const customRoutes = require("./routes/routes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/cart", cartRoutes);
app.use("/api/menu", menuItemRoutes);

app.use("/api/customer",authMiddleware.authenticateToken, authMiddleware.checkCustomerRole, adminRoutes, customerRoutes);
app.use("/api/order", orderRoutes);

app.use("/api", customRoutes);
app.use("/", authRoutes);
app.use("/api/admin",authMiddleware.authenticateToken, authMiddleware.checkAdminRole, adminRoutes);
app.use("/api/chef",authMiddleware.authenticateToken, authMiddleware.checkChefRole, chefRoutes);

// Start server

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
