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
      this.hasMany(FriendRequest, { foreignKey: 'senderId' });
      this.hasMany(FriendRequest, { foreignKey: 'receiverId' });
      this.hasMany(Contact, { foreignKey: 'userId' });
      this.hasMany(Contact, { foreignKey: 'friendId' });
      this.hasMany(Message, { foreignKey: 'senderId' });
      this.hasMany(Message, { foreignKey: 'receiverId' });

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