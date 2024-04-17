const bcrypt = require("bcrypt");
const User = require("../model/userModel");
const Restaurant = require("../model/restaurantModel");
const jwt = require("jsonwebtoken");
const DeliveryBoy = require("../model/deliveryBoyModel");

//USER CONTROLLERS

const signupController = async (req, res) => {
  try {
    const { userName, email, password, address, recoveryQuestion, phone } =
      req.body;

    // VALIDATING THE USER INPUT
    if (
      !userName ||
      !email ||
      !password ||
      !address ||
      !recoveryQuestion ||
      !phone
    ) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    const existingEmail = await User.findOne({ where: { email } });

    if (existingEmail) {
      return res.status(400).send({
        success: false,
        message: "Email already exists, please login",
      });
    }

    // VALIDATING THE PASSWORD
    if (password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check for at least one uppercase, one lowercase, and one numerical/symbol character
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumberOrSymbol = /[0-9\W]/.test(password);

    //checks lowercase letters
    if (!hasLowerCase) {
      return res.status(400).send({
        success: false,
        message: "Please include lowercase letters in password",
      });
    }

    //checks uppercase letters
    if (!hasUpperCase) {
      return res.status(400).send({
        success: false,
        message: "Please include uppercase letters in password",
      });
    }
    //checks numericals or symbols letters
    if (!hasNumberOrSymbol) {
      return res.status(400).send({
        success: false,
        message: "Please include numerical or symbol in password",
      });
    }

    // HASHING PASSWORD
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    // CREATE NEW USER
    const newUser = await User.create({
      name: userName,
      email,
      phone,
      password: hashedPassword,
      address,
      recovery_question: recoveryQuestion,
    });

    return res.status(201).send({
      success: true,
      message: "Account created successfully",
      newUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error occurred while creating account",
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    //REQUIRED BOTH FIELDS
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "required both email and password",
      });
    }
    //CHECK WHETHER USER EXIST OR NOT
    const userExist = await User.findOne({ where: { email } });

    //IF USER DONT EXIST RETURN ERROR
    if (!userExist) {
      return res.status(404).send({
        success: false,
        message: "user not found please sign up",
      });
    }

    //COMPARE PASSWORD
    const passwordMatch = await bcrypt.compare(password, userExist.password);

    if (passwordMatch) {
      //GENERATING JWT TOKENS
      const token = jwt.sign(
        { userId: userExist.userId },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      return res.status(200).send({
        success: true,
        message: "successfully login",
        userExist,
        token,
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "invalid credentials",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error occured while logging to your account",
    });
  }
};

const userUpdateController = async (req, res) => {
  try {
    const { userName, profileUrl, phone, address, recoveryQuestion } = req.body;

    const user = await User.findByPk(req.user.userId);

    if (userName) {
      await user.update({
        name: userName,
      });
    }

    if (profileUrl) {
      await user.update({
        profile_url: profileUrl,
      });
    }

    if (phone) {
      await user.update({
        phone: phone,
      });
    }

    if (address) {
      await user.update({
        address: address,
      });
    }
    if (recoveryQuestion) {
      await user.update({
        recovery_question: recoveryQuestion,
      });
    }

    return res.status(200).send({
      success: true,
      message: "user info",
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error at user update api",
    });
  }
};

const changePasswordController = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "user not found",
      });
    }

    const { newPassword, reEnteredNewPassword, oldPassword } = req.body;

    if (!newPassword || !reEnteredNewPassword || !oldPassword) {
      return res.status(500).send({
        success: false,
        message:
          "new password, re-entered new password, and old password required ",
      });
    }

    //checking the whether both the conformation password and new password
    const newPasswordMatched = newPassword == reEnteredNewPassword;

    if (!newPasswordMatched) {
      return res.status(500).send({
        success: false,
        message: "new password and re entered new password doesn't matched",
      });
    }
    //comparing the old password with the entered password
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      return res.status(500).send({
        success: false,
        message: "old password does'nt match with orginal password",
      });
    }

    // HASHING PASSWORD
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);

    await user.update({
      password: hashedPassword,
    });

    return res.status(200).send({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error change password api",
    });
  }
};

const recoverPasswordController = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "user not found",
      });
    }

    const { recoveryQuestion, newPassword, reEnteredNewPassword } = req.body;

    if (!recoveryQuestion || !newPassword || !reEnteredNewPassword) {
      return res.status(500).send({
        success: false,
        message: "required all fields",
      });
    }

    const newPasswordMatched = newPassword == reEnteredNewPassword;

    if (!newPasswordMatched) {
      return res.status(500).send({
        success: false,
        message: "new password and re entered new password doesn't matched",
      });
    }

    const recoveryQuestionMatched = recoveryQuestion == user.recovery_question;

    if (!recoveryQuestionMatched) {
      return res.status(500).send({
        success: false,
        message: "recovery question not matched please enter valid answer",
      });
    }

    // HASHING PASSWORD
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);

    await user.update({
      password: hashedPassword,
    });

    return res.status(200).send({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error at reset password api",
    });
  }
};

//RESTAURANT CONTROLLERS

const restaurantRegisterController = async (req, res) => {
  try {
    const {
      rName,
      rEmail,
      rPassword,
      rProfil,
      rCover,
      rAddress,
      rPhone,
      rRecoveryQuestion,
    } = req.body;

    const restaurantExist = await Restaurant.findOne({
      where: { email: rEmail },
    });

    if (
      (!rName || !rEmail || !rPassword || !rAddress,
      !rPhone,
      !rRecoveryQuestion)
    ) {
      return res.status(500).send({
        success: false,
        message: "Required all fields",
      });
    }

    if (restaurantExist) {
      return res.status(500).send({
        success: false,
        message: "Restaurant email already exist please login",
      });
    }

    // VALIDATING THE PASSWORD
    if (rPassword.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check for at least one uppercase, one lowercase, and one numerical/symbol character
    const hasUpperCase = /[A-Z]/.test(rPassword);
    const hasLowerCase = /[a-z]/.test(rPassword);
    const hasNumberOrSymbol = /[0-9\W]/.test(rPassword);

    //checks lowercase letters
    if (!hasLowerCase) {
      return res.status(400).send({
        success: false,
        message: "Please include lowercase letters in password",
      });
    }

    //checks uppercase letters
    if (!hasUpperCase) {
      return res.status(400).send({
        success: false,
        message: "Please include uppercase letters in password",
      });
    }
    //checks numericals or symbols letters
    if (!hasNumberOrSymbol) {
      return res.status(400).send({
        success: false,
        message: "Please include numerical or symbol in password",
      });
    }

    // HASHING PASSWORD
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(rPassword, saltRounds);

    const newRestaurant = Restaurant.create({
      name: rName,
      email: rEmail,
      phone: rPhone,
      password: hashedPassword,
      address: rAddress,
      profile_url: rProfil,
      cover_url: rCover,
      recovery_question: rRecoveryQuestion,
    });

    //hiding the password
    newRestaurant.password = undefined;

    return res.status(200).send({
      success: true,
      message: "successfully created..",
      newRestaurant: newRestaurant,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: true,
      message: "Error at restaurant register api",
    });
  }
};

const restaurantLoginController = async (req, res) => {
  try {
    const { rEmail, rPassword } = req.body;

    //REQUIRED BOTH FIELDS
    if (!rEmail || !rPassword) {
      return res.status(500).send({
        success: false,
        message: "required both email and password",
      });
    }

    //CHECK WHETHER USER EXIST OR NOT
    const restaurantExist = await Restaurant.findOne({
      where: { email: rEmail },
    });

    //IF USER DONT EXIST RETURN ERROR
    if (!restaurantExist) {
      return res.status(404).send({
        success: false,
        message: "user not found please sign up",
      });
    }

    //COMPARE PASSWORD
    const passwordMatch = await bcrypt.compare(
      rPassword,
      restaurantExist.password
    );

    if (passwordMatch) {
      //GENERATING JWT TOKENS
      const token = jwt.sign(
        { restaurantId: restaurantExist.restaurantId },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      return res.status(200).send({
        success: true,
        message: "successfully login",
        restaurantExist,
        token,
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "invalid credentials",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error occurred while logging to your account",
    });
  }
};

const updateRestaurantProfileController = async (req, res) => {
  try {
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

const changeRestaurantPasswordController = async (req, res) => {
  try {
    const { rNewPassword, rConformationPassword, rOldPassword } = req.body;

    const restaurantExist = await Restaurant.findByPk(
      req.restaurant.restaurantId
    );

    if (!restaurantExist) {
      return res.status(404).send({
        success: false,
        message: "Restaurant not found",
      });
    }

    if (!rNewPassword || !rConformationPassword || !rOldPassword) {
      return res.status(500).send({
        success: false,
        message: "required all fields",
      });
    }

    const newPasswordMatched = rNewPassword == rConformationPassword;

    if (!newPasswordMatched) {
      return res.status(500).send({
        success: false,
        message: "new password and conformation pass not matched",
      });
    }

    const isMatched = await bcrypt.compare(
      rOldPassword,
      restaurantExist.password
    );

    // HASHING PASSWORD
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(rNewPassword, saltRounds);

    if (!isMatched) {
      return res.status(500).send({
        success: false,
        message: "new password and old password does'nt match",
      });
    }

    await restaurantExist.update({
      password: hashedPassword,
    });

    return res.status(200).send({
      success: true,
      message: "successfully changed password of your restaurant",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error at change restaurant password controller api",
    });
  }
};

const recoverRestaurantPasswordController = async (req, res) => {
  try {
    const restaurant = await User.findByPk(req.restaurant.restaurantId);

    if (!restaurant) {
      return res.status(404).send({
        success: false,
        message: "user not found",
      });
    }

    const { rRecoveryQuestion, rNewPassword, rConformationPassword } = req.body;

    if (!rRecoveryQuestion || !rNewPassword || !rConformationPassword) {
      return res.status(500).send({
        success: false,
        message: "required all fields",
      });
    }

    const newPasswordMatched = rNewPassword == rConformationPassword;

    if (!newPasswordMatched) {
      return res.status(500).send({
        success: false,
        message: "new password and re entered new password doesn't matched",
      });
    }

    const recoveryQuestionMatched =
      rRecoveryQuestion == restaurant.recovery_question;

    if (!recoveryQuestionMatched) {
      return res.status(500).send({
        success: false,
        message: "recovery question not matched please enter valid answer",
      });
    }

    // HASHING PASSWORD
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(rNewPassword, saltRounds);

    await restaurant.update({
      password: hashedPassword,
    });

    return res.status(200).send({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error at reset password api",
    });
  }
};

//DELIVERY BOY AUTH CONTROLLERS

const registerDeliveryBoyController = async (req, res) => {
  try {
    const {
      dName,
      dEmail,
      dPassword,
      dRecoveryQuestion,
      dPhone,
      dVehicleNo,
      dVehicleModel,
    } = req.body;

    // VALIDATING THE USER INPUT
    if (
      !dName ||
      !dEmail ||
      !dPassword ||
      !dRecoveryQuestion ||
      !dPhone ||
      !dVehicleModel ||
      !dVehicleNo
    ) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    const existingEmail = await DeliveryBoy.findOne({
      where: { email: dEmail },
    });

    if (existingEmail) {
      return res.status(400).send({
        success: false,
        message: "Email already exists, please login",
      });
    }

    // VALIDATING THE PASSWORD
    if (dPassword.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check for at least one uppercase, one lowercase, and one numerical/symbol character
    const hasUpperCase = /[A-Z]/.test(dPassword);
    const hasLowerCase = /[a-z]/.test(dPassword);
    const hasNumberOrSymbol = /[0-9\W]/.test(dPassword);

    //checks lowercase letters
    if (!hasLowerCase) {
      return res.status(400).send({
        success: false,
        message: "Please include lowercase letters in password",
      });
    }

    //checks uppercase letters
    if (!hasUpperCase) {
      return res.status(400).send({
        success: false,
        message: "Please include uppercase letters in password",
      });
    }
    //checks numericals or symbols letters
    if (!hasNumberOrSymbol) {
      return res.status(400).send({
        success: false,
        message: "Please include numerical or symbol in password",
      });
    }

    // HASHING PASSWORD
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(dPassword, saltRounds);

    // CREATE NEW USER
    const newDeliveryBoy = await DeliveryBoy.create({
      name: dName,
      email: dEmail,
      phone: dPhone,
      password: hashedPassword,
      recovery_question: dRecoveryQuestion,
      vehicleName: dVehicleModel,
      vehicleNo: dVehicleNo,
    });

    return res.status(201).send({
      success: true,
      message: "Account created successfully",
      newDeliveryBoy,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error occurred while creating account",
    });
  }
};

const loginDeliveryBoyController = async (req, res) => {
  try {
    const { dEmail, dPassword } = req.body;

    //REQUIRED BOTH FIELDS
    if (!dEmail || !dPassword) {
      return res.status(500).send({
        success: false,
        message: "required both email and password",
      });
    }
    //CHECK WHETHER USER EXIST OR NOT
    const userExist = await DeliveryBoy.findOne({ where: { email: dEmail } });

    //IF USER DONT EXIST RETURN ERROR
    if (!userExist) {
      return res.status(404).send({
        success: false,
        message: "user not found please sign up",
      });
    }

    //COMPARE PASSWORD
    const passwordMatch = await bcrypt.compare(dPassword, userExist.password);

    if (passwordMatch) {
      //GENERATING JWT TOKENS
      const token = jwt.sign(
        { deliveryBoyId: userExist.deliveryBoyId },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      return res.status(200).send({
        success: true,
        message: "successfully login",
        userExist,
        token,
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "invalid credentials",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error occured while logging to your account",
    });
  }
};

const updateDeliveryBoyProfileController = async (req, res) => {
  try {
    const { dName, dPhone, dVehicleModel, dVehicleNo, dRecoveryQuestion } =
      req.body;

    const deliveryBoyExist = await DeliveryBoy.findByPk(
      req.deliveryBoy.deliveryBoyId
    );

    //Checking the restaurant in DB
    if (!deliveryBoyExist) {
      return res.status(404).send({
        success: false,
        message: "restaurant not found in update restaurant",
      });
    }

    if (dName) {
      await deliveryBoyExist.update({
        name: dName,
      });
    }

    if (dPhone) {
      await deliveryBoyExist.update({
        phone: dPhone,
      });
    }

    if (dVehicleModel) {
      await deliveryBoyExist.update({
        vehicleName: dVehicleModel,
      });
    }

    if (dRecoveryQuestion) {
      await deliveryBoyExist.update({
        recovery_question: dRecoveryQuestion,
      });
    }

    if (dVehicleNo) {
      await deliveryBoyExist.update({
        vehicleNo: dVehicleNo,
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

const changeDeliveryboyPasswordController = async (req, res) => {
  try {
    const { dNewPassword, dConformationPassword, dOldPassword } = req.body;

    const deliveryBoyExist = await DeliveryBoy.findByPk(
      req.deliveryBoy.deliveryBoyId
    );

    if (!deliveryBoyExist) {
      return res.status(404).send({
        success: false,
        message: "Restaurant not found",
      });
    }

    if (!dNewPassword || !dConformationPassword || !dOldPassword) {
      return res.status(500).send({
        success: false,
        message: "required all fields",
      });
    }

    const newPasswordMatched = dNewPassword == dConformationPassword;

    if (!newPasswordMatched) {
      return res.status(500).send({
        success: false,
        message: "new password and conformation pass not matched",
      });
    }

    const isMatched = await bcrypt.compare(
      dOldPassword,
      deliveryBoyExist.password
    );

    // HASHING PASSWORD
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(dNewPassword, saltRounds);

    if (!isMatched) {
      return res.status(500).send({
        success: false,
        message: "new password and old password does'nt match",
      });
    }

    await deliveryBoyExist.update({
      password: hashedPassword,
    });

    return res.status(200).send({
      success: true,
      message: "successfully changed password of your restaurant",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error at change delivery password controller api",
    });
  }
};

const recoverDeliveryBoyPasswordController = async (req, res) => {
  try {
    const deliveryBoyExist = await DeliveryBoy.findByPk(
      req.deliveryBoy.deliveryBoyId
    );

    if (!deliveryBoyExist) {
      return res.status(404).send({
        success: false,
        message: "user not found",
      });
    }

    const { dRecoveryQuestion, dNewPassword, dConformationPassword } = req.body;

    if (!dRecoveryQuestion || !dNewPassword || !dConformationPassword) {
      return res.status(500).send({
        success: false,
        message: "required all fields",
      });
    }

    const newPasswordMatched = dNewPassword == dConformationPassword;

    if (!newPasswordMatched) {
      return res.status(500).send({
        success: false,
        message: "new password and re entered new password doesn't matched",
      });
    }

    console.log(deliveryBoyExist.recovery_question);

    const recoveryQuestionMatched =
      dRecoveryQuestion == deliveryBoyExist.recovery_question;

    if (!recoveryQuestionMatched) {
      return res.status(500).send({
        success: false,
        message: "recovery question not matched please enter valid answer",
      });
    }

    // HASHING PASSWORD
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(dNewPassword, saltRounds);

    await deliveryBoyExist.update({
      password: hashedPassword,
    });

    return res.status(200).send({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error at reset password api",
    });
  }
};
module.exports = {
  //CLIENT EXPORTS
  signupController,
  loginController,
  userUpdateController,
  changePasswordController,
  recoverPasswordController,

  //RESTAURANT EXPORTS
  restaurantRegisterController,
  restaurantLoginController,
  updateRestaurantProfileController,
  changeRestaurantPasswordController,
  recoverRestaurantPasswordController,

  //DELIVERY BOY EXPORTS
  registerDeliveryBoyController,
  loginDeliveryBoyController,
  updateDeliveryBoyProfileController,
  changeDeliveryboyPasswordController,
  recoverDeliveryBoyPasswordController,
};
