const express = require("express");
const app = express(); //instancia do express
const bodyParser = require("body-parser");
const connection = require("./database/database");
const session = require("express-session");

const categoriesController= require("./categories/CategoriesController.js");
const articlesController= require("./articles/ArticlesController.js");
const usersController= require("./users/UsersController");


const Article=require("./articles/Article"); 
const Category=require("./categories/Category");
const User = require("./users/User");

//view engine
app.set('view engine','ejs');  

//sessions
app.use(session({
    secret: "qualquercoisaaleatoria",cookie:{ maxAge:3000000} //palavra ou senha aleatoria pra aumentar segurança da sessão
}));                                                  //maxAge é o tempo de duracao do cookie,colocado em milisegundos


//static
app.use(express.static('public')); 

//body parser
app.use(bodyParser.urlencoded({extended:false})); //body parser
app.use(bodyParser.json());

//database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com Sucesso");

    }).catch((error)=>{
        console.log(error);
    });

app.use("/",categoriesController);    
app.use("/",articlesController);  
app.use("/",usersController);

app.get("/",(req,res)=>{
    
    Article.findAll({
        order:[
            ['id','DESC']
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories =>{
            var uniquepage=1;
            res.render("index",{articles: articles,categories:categories,uniquepage:uniquepage});
        })
    });
})

app.get("/admbar",(req,res)=>{
    
    Article.findAll({
        order:[
            ['id','DESC']
        ],
        limit: 7
    }).then(articles => {
        Category.findAll().then(categories =>{
            var uniquepage=1;
            res.render("admbar",{articles: articles,categories:categories,uniquepage:uniquepage});
        })
    });
})

app.get("/:slug",(req,res)=>{
    var slug= req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article=>{
        if(article != undefined){
            Category.findAll().then(categories =>{
                res.render("article",{article:article,categories:categories});
            });
        }else{
            res.redirect("/");
        }
    }).catch(error =>{
        res.redirect("/");
    });
})
app.get("/category/:slug",(req,res)=>{
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model:Article}]   
    }).then(category => { 
        if(category != undefined){
            Category.findAll().then(categories => {
                var uniquepage = 0;
                res.render("index",{articles: category.articles,categories:categories,uniquepage:uniquepage}); 
            });                           
        }else{
            res.redirect("/");
        }
    }).catch(error => {
        res.redirect("/");
    });
});

app.listen(8080,()=>{
    console.log("O servidor está rodando !");
});