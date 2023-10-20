const Sequelize = require("sequelize");
const connection = require("../database/database");


const Category = connection.define('categories',{ //categories: nome da tabela

    title:{
        type: Sequelize.STRING,
        allowNull: false
    },slug:{
        type: Sequelize.STRING,                 //slug quer dizer que se algo foi escrito e tiver espaço entre as palavras,é colocado um "-" entre as palavras
        allowNull: false
    }
});


module.exports = Category;

