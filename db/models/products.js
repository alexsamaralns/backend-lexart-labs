const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

module.exports = sequelize.define(
  "product",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "title cannot be null",
        },
        notEmpty: {
          msg: "title cannot be empty",
        },
      },
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "brand cannot be null",
        },
        notEmpty: {
          msg: "brand cannot be empty",
        },
      },
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "model cannot be null",
        },
        notEmpty: {
          msg: "model cannot be empty",
        },
      },
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: "price cannot be null",
        },
        isDecimal: {
          msg: "price value must be in decimal",
        },
      },
    },
    operating_system: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "operating_system cannot be null",
        },
        notEmpty: {
          msg: "operating_system cannot be empty",
        },
      },
    },
    createBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
    modelName: "product",
  }
);
