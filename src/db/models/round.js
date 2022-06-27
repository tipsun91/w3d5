'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Round extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      Round.belongsTo(User, {foreignKey: 'user_id'});
    }

  }
  Round.init({
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      }
    },
    score: {
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'Round',
  });
  return Round;
};