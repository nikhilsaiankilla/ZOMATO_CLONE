const { Sequelize } = require("sequelize");

// Initialize Sequelize with database credentials
const sequelize = new Sequelize("tomato_food", "root", "Nikhil@0146", {
  host: "localhost",
  dialect: "mysql",
});

// Test the database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

module.exports = { sequelize, testConnection };
