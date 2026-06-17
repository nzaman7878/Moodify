const userModel = require("../models/user.model");

const jwt = require("jsonwebtoken");

async function authUser(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found. Please login to access this resource",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid token. Please login to access this resource",
    });
  }
}

module.exports = authUser;