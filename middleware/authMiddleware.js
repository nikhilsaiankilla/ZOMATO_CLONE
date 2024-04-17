const JWT = require("jsonwebtoken");
const User = require("../model/userModel");
const Restaurant = require("../model/restaurantModel");
const DeliveryBoy = require("../model/deliveryBoyModel");

const authMiddleware = async (req, res, next) => {
  try {
    // Retrieve the Authorization header from the request
    const authHeader = req.headers["authorization"];

    // Check if the Authorization header exists
    if (!authHeader) {
      return res.status(401).send({
        success: false,
        message: "Authorization header is missing",
      });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1]; // Split by space and get the second part

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Token is missing",
      });
    }

    // Verify the token
    JWT.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        return res.status(403).send({
          success: false,
          message: "Invalid or expired token",
        });
      }

      // Check if the user associated with the token exists
      const user = await User.findByPk(decodedToken.userId);

      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found",
        });
      }

      // Add the user object to the request for further processing
      req.user = user;

      next();
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "error at user auth middleware",
    });
  }
};

const authRestaurantMiddleware = async (req, res, next) => {
  try {
    // Retrieve the Authorization header from the request
    const authHeader = req.headers["authorization"];

    // Check if the Authorization header exists
    if (!authHeader) {
      return res.status(401).send({
        success: false,
        message: "Authorization header is missing",
      });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1]; // Split by space and get the second part

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Token is missing",
      });
    }

    JWT.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        return res.status(403).send({
          success: false,
          message: "Invalid or expired token",
        });
      }

      const restaurant = await Restaurant.findByPk(decodedToken.restaurantId);

      if (!restaurant) {
        return res.status(404).send({
          success: false,
          message: "restaurant not found",
        });
      }

      // Add the user object to the request for further processing
      req.restaurant = restaurant;
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error at the restaurant auth api",
    });
  }
};

const authDeliveryMiddleware = async (req, res, next) => {
  try {
    // Retrieve the Authorization header from the request
    const authHeader = req.headers["authorization"];

    // Check if the Authorization header exists
    if (!authHeader) {
      return res.status(401).send({
        success: false,
        message: "Authorization header is missing",
      });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1]; // Split by space and get the second part

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Token is missing",
      });
    }

    JWT.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        return res.status(403).send({
          success: false,
          message: "Invalid or expired token",
        });
      }

      const deliveryBoyExist = await DeliveryBoy.findByPk(
        decodedToken.deliveryBoyId
      );

      if (!deliveryBoyExist) {
        return res.status(404).send({
          success: false,
          message: "restaurant not found",
        });
      }

      // Add the user object to the request for further processing
      req.deliveryBoy = deliveryBoyExist;
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error at the restaurant auth api",
    });
  }
};

module.exports = {
  authMiddleware,
  authRestaurantMiddleware,
  authDeliveryMiddleware,
};
