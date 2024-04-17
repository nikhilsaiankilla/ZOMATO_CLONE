const testController = async (req, res) => {
  res.status(200).send({
    success: true,
    message: "this is test user..!",
  });
};

module.exports = { testController };
