const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateToken = async (req, res, next) => {

  try {
 
     const authHeader = req.headers["authorization"];
 
     const token = authHeader && authHeader.split(" ")[1];
 
 
     if (!token) {
 
       return res.status(401).json({ error: "Access token is missing!" });
 
     }
 
 
     jwt.verify(token, "SecretKey", (err, decodedToken) => {
 
       if (err) {
 
         return res.status(403).json({ error: "Access token is not valid!" });
 
       }
 
 
       req.user = decodedToken; 
 
       // Set the decoded token to req.user
 
       next(); // Move this line here
 
     });
 
  } catch (err) {
 
     res.status(500).json({ error: err.message });
 
  }
 
 };
const checkUserRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      console.error("User not found in request:", req.user);
      return res.status(403).json({ error: "Forbidden access!" });
    }

    if (req.user.role !== role) {
      console.error(`User role (${req.user.role}) does not match required role (${role})`);
      return res.status(403).json({ error: "Forbidden access!" });
    }

    next();
  };
};


const checkAdminRole = checkUserRole("admin");
const checkChefRole = checkUserRole("chef");
const checkCustomerRole = checkUserRole("customer")

module.exports = { authenticateToken, checkUserRole, checkAdminRole, checkChefRole, checkCustomerRole };
