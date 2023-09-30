'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'senderId' });
      this.belongsTo(models.User, { foreignKey: 'receiverId' });

    }
  }
  Message.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    senderId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
    edited: DataTypes.BOOLEAN,
    description: DataTypes.STRING,
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'Message',
    timestamps: false,
  });
  return Message;
};