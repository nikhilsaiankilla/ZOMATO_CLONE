const User = require("../model/userModel");

const getUserController = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Hide password
    user.password = undefined;

    return res.status(200).send({
      success: true,
      message: "User found successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error occurred while fetching user",
    });
  }
};

module.exports = {
  getUserController,
};
