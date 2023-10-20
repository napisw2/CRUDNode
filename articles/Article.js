const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category");

const Article = connection.define('articles',{ 

    title:{
        type: Sequelize.STRING,
        allowNull: false
    },slug:{
        type: Sequelize.STRING,                
        allowNull: false
    },body:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});


Category.hasMany(Article); // Uma categoria para muitos artigos.
Article.belongsTo(Category); //estamos fazendo uma ligacao de relacionamento entre o artigo e categoria,enviando o artigo.




module.exports= Article;