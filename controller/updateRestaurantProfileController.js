const Restaurant = require("../model/restaurantModel");

const updateRestaurantProfileController = async (req, res) => {
  try {
    EXTRACT;
    ALL;
    FIELDS;
    const {
      rName,
      rPhone,
      rProfileUrl,
      rCoverUrl,
      rRecoveryQuestion,
      rAddress,
    } = req.body;

    const restaurantExist = await Restaurant.findByPk(
      req.restaurant.restaurantId
    );

    //Checking the restaurant in DB
    if (!restaurantExist) {
      return res.status(404).send({
        success: false,
        message: "restaurant not found in update restaurant",
      });
    }

    if (rName) {
      await restaurantExist.update({
        name: rName,
      });
    }

    if (rPhone) {
      await restaurantExist.update({
        phone: rPhone,
      });
    }

    if (rAddress) {
      await restaurantExist.update({
        address: rAddress,
      });
    }

    if (rRecoveryQuestion) {
      await restaurantExist.update({
        recovery_question: rRecoveryQuestion,
      });
    }

    if (rProfileUrl) {
      await restaurantExist.update({
        profile_url: rProfileUrl,
      });
    }

    if (rCoverUrl) {
      await restaurantExist.update({
        cover_url: rCoverUrl,
      });
    }

    return res.status(200).send({
      success: true,
      message: "successfully updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error at the update restaurant api",
    });
  }
};
