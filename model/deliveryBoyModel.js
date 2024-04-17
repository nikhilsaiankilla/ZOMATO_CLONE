const { DataTypes } = require("sequelize");
const { sequelize } = require("./../config/database");

const DeliveryBoy = sequelize.define(
  "DeliveryBoy",
  {
    deliveryBoyId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicleName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicleNo: {
      type: DataTypes.STRING,
      allowNull: false,
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

module.exports = DeliveryBoy;
