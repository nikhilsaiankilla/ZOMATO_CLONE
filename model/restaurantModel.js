const { DataTypes } = require("sequelize");
const { sequelize } = require("./../config/database");

const Restaurant = sequelize.define(
  "Restaurant",
  {
    restaurantId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile_url: {
      type: DataTypes.STRING,
      defaultValue:
        "https://b.zmtcdn.com/data/pictures/7/20816697/c7f03c86e3b3c1c160bdb1400ff01222.jpg?fit=around|771.75:416.25&crop=771.75:416.25;*,*",
    },
    cover_url: {
      type: DataTypes.STRING,
      defaultValue:
        "https://b.zmtcdn.com/data/pictures/7/20816697/c7f03c86e3b3c1c160bdb1400ff01222.jpg?fit=around|771.75:416.25&crop=771.75:416.25;*,*",
    },
    isOpen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    recovery_question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

module.exports = Restaurant;
