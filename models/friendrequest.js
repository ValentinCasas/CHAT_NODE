'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FriendRequest extends Model {
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
  FriendRequest.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    senderId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN,
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'FriendRequest',
    tableName: 'FriendRequest',
    timestamps: false,
  });
  return FriendRequest;
};