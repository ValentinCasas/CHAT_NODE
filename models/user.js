'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.FriendRequest, { foreignKey: 'senderId' });
      this.hasMany(models.FriendRequest, { foreignKey: 'receiverId' });
      this.hasMany(models.Contact, { foreignKey: 'userId' });
      this.hasMany(models.Contact, { foreignKey: 'friendId' });
      this.hasMany(models.Message, { foreignKey: 'senderId', as: 'sender' });
      this.hasMany(models.Message, { foreignKey: 'receiverId', as: 'receiver' });

    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatarUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'User',
    timestamps: false,
  });
  return User;
};