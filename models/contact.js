'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(User, { foreignKey: 'userId' });
      this.belongsTo(User, { foreignKey: 'friendId' });

    }
  }
  Contact.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: DataTypes.INTEGER,
    friendId: DataTypes.INTEGER,
    ping: DataTypes.BOOLEAN,
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Contact',
    tableName: 'Contact',
    timestamps: false,
  });
  return Contact;
};