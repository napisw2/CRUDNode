const Sequelize = require("sequelize");
const connection = require("../database/database");


const User = connection.define('users',{ //users: nome da tabela

    email:{
        type: Sequelize.STRING,
        allowNull:false
    },password:{
        type: Sequelize.STRING,               
        allowNull:false
    }
});

module.exports = User;

//nesse arquivo todo temos o model de Categories.