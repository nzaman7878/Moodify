const blacklistModel = require("../models/backlist.model");
const redisClient = require("../config/cache");
const redis = require("../config/cache");
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

    // Check blacklist
    const blacklistedToken = await redisClient.get(token);

    if (blacklistedToken) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again",
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