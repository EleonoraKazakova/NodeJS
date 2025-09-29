const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const CartItem = sequelize.define('cartItem', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrements: true,
        allowNull: false,
        primaryKey: true
    },
    quantaty: Sequelize.INTEGER
});

module.exports = CartItem