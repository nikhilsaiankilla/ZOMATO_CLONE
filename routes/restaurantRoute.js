const express = require("express");
const {
  getAllRestaurantsController,
  getRestaurantController,
} = require("../controller/restaurantController");

const router = express.Router();

router.get("/getAllRestaurants", getAllRestaurantsController);

router.get("/getRestaurant/:id", getRestaurantController);

module.exports = router;
