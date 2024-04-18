const Restaurant = require("../model/restaurantModel");

const getAllRestaurantsController = async (req, res) => {
  try {
    const allRestaurants = await Restaurant.findAll();

    if (!allRestaurants) {
      return res.status(404).send({
        success: false,
        message: "something went wrong while fetching",
      });
    }

    return res.status(200).send({
      success: true,
      allRestaurants,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "something went wrong in the get all restaurant api",
    });
  }
};

const getRestaurantController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(500).send({
        success: false,
        message: "restaurant id is missing",
      });
    }

    const restaurant = await Restaurant.findByPk(id);

    if (!restaurant) {
      return res.status(404).send({
        success: false,
        message: "restaurant not found",
      });
    }

    restaurant.password = undefined;
    restaurant.recovery_question = undefined;

    return res.status(200).send({
      success: true,
      message: "successfully fetched",
      restaurant,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "something went wrong in the get restaurant api",
    });
  }
};

module.exports = { getAllRestaurantsController, getRestaurantController };
