const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const { sequelize } = require("./config/database");
const dotenv = require("dotenv");

const app = express();

//MIDDLEWARES
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("combined"));

dotenv.config();

//ROUTES
app.use("/test", require("./routes/testRoute"));

app.use("/v1/api/auth", require("./routes/authRoute"));

app.use("/v1/api/user", require("./routes/userRoute"));

app.use("/v1/api/restaurants", require("./routes/restaurantRoute"));

app.get("/", (req, res) => {
  res.send({
    success: true,
    message: "server running",
  });
});

const PORT = process.env.PORT || 8080;

sequelize
  .sync({ force: false })
  .then(() => {
    console.log(
      "All models synced to the database successfully.".white.bgMagenta
    );
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`.red.bgBlue);
    });
  })
  .catch((err) => {
    console.error("Unable to sync models to the database:", err);
  });
