const express = require("express");
const {
  signupController,
  loginController,
  userUpdateController,
  changePasswordController,
  recoverPasswordController,
  restaurantRegisterController,
  restaurantLoginController,
  updateRestaurantProfileController,
  changeRestaurantPasswordController,
  recoverRestaurantPasswordController,
  registerDeliveryBoyController,
  loginDeliveryBoyController,
  changeDeliveryboyPasswordController,
  recoverDeliveryBoyPasswordController,
  updateDeliveryBoyProfileController,
} = require("../controller/authController");
const {
  authMiddleware,
  authRestaurantMiddleware,
  authDeliveryMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

//USER AUTH ROUTES

router.post("/signup", signupController);

router.post("/login", loginController);

router.post("/updateUser", authMiddleware, userUpdateController);

router.post("/changePassword", authMiddleware, changePasswordController);

router.post("/recoverPassword", authMiddleware, recoverPasswordController);

//RESTAURANT AUTH ROUTES

router.post("/restaurant/register", restaurantRegisterController);

router.post("/restaurant/login", restaurantLoginController);

router.post(
  "/restaurant/updateRestaurant",
  authRestaurantMiddleware,
  updateRestaurantProfileController
);

router.post(
  "/restaurant/changePassword",
  authRestaurantMiddleware,
  changeRestaurantPasswordController
);

router.post(
  "/restaurant/recoverPassword",
  authRestaurantMiddleware,
  recoverRestaurantPasswordController
);

//DELIVERY BOY AUTH ROUTES

router.post("/deliveryBoy/register", registerDeliveryBoyController);

router.post("/deliveryBoy/login", loginDeliveryBoyController);

router.post(
  "/deliveryboy/updateProfile",
  authDeliveryMiddleware,
  updateDeliveryBoyProfileController
);

router.post(
  "/deliveryBoy/changePassword",
  authDeliveryMiddleware,
  changeDeliveryboyPasswordController
);

router.post(
  "/deliveryBoy/recoverPassword",
  authDeliveryMiddleware,
  recoverDeliveryBoyPasswordController
);

module.exports = router;
