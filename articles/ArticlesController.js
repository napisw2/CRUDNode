const express = require("express");
const router = express.Router();                   //objeto utilizado para criar rotas
const Category = require("../categories/Category");
const slugify = require("slugify");
const Article = require("./Article");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/articles",adminAuth,(req,res)=>{
    Article.findAll({
        include:[{model:Category}] //estamos incluindo o model category para rastreio do titulo da categoria
    }).then(articles=>{
        res.render("admin/articles/index",{articles: articles})
    });
});

router.get("/admin/articles/new",(req,res)=>{
    Category.findAll().then(categories=>{
        res.render("admin/articles/new",{categories:categories})
    }) 
});

router.post("/articles/save",(req,res)=>{
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category          //no Article.js criamos um relacionamento entre categoria e artigo,após isso automaticamente uma foreign key é criada com o nome: categoryId ,ela vem do belongsto
    }).then(()=>{
        res.redirect("/admin/articles");
    });
});

router.post("/articles/delete",(req,res)=>{
    var id = req.body.id;
    if( id != undefined ){
        if(!isNaN(id)){    //isNaN utilizado para ver se o valor não é número(int) , ou seja : !isNAN= é um numero
            Article.destroy({
                where:{
                     id: id
                }
            }).then(() => {
                res.redirect("/admin/articles");
            });
        }else{ //caso id nao seja um numero
            res.redirect("/admin/articles");
        }
    }else{     //caso id seja null
         res.redirect("/admin/articles");
    }     
});

router.get("/admin/articles/edit/:id",(req,res)=>{
    var id = req.params.id;
    Article.findByPk(id).then(article =>{   //pesquisando artigo pelo ID dele
        if(article != undefined){
            Category.findAll().then(categories =>{
                 res.render("admin/articles/edit",{categories:categories,article:article})  //exibicao do select
            });        
        }else{
            res.redirect("/");
        }
    }).catch(error =>{
        res.redirect("/");
    })
});

router.post("/articles/update",(req,res)=>{
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.update({title: title,body: body, categoryId: category,slug: slugify(title)},{
        where:{
            id: id
        }
    }).then(()=>{
        res.redirect("/admin/articles");
    }).catch(error=>{
        res.redirect("/");
    })
});

router.get("/articles/page/:num",(req,res)=>{
    var page = req.params.num;
    var offset = 0;
    if(isNaN(page) || page == 1){  //verifica se a pagina NAO é um numero 
        offset = 0;   //mesmo pagina sendo 1,colocamos offset =0 pq queremos mostrar desde o elemento 0,q seria o primeiro
    }else{  
        offset = (parseInt(page)-1) * 4;   //aqui estamos calculando nosso ofFset para sempre pular de 4 em 4,o parseint serve para transformar a string em numero,ja que recebeos string no get
    }

    Article.findAndCountAll({
        limit: 4,
        offset: offset
    }).then(articles=>{
        var next;
        console.log(articles)
        if(offset + 4  >= articles.count){ //  aqui estamos fazendo com que nao passe do numero máximo de paginas,através do articles.count,que nos dá o valor máximo de paginas
            next = false;
        }else{
            next = true;
        }
        var result = {
            page: parseInt(page),
            next: next,
            articles: articles          
        }
        Category.findAll().then(categories => {
            res.render("admin/articles/page",{result: result,categories: categories})
        });
    })
});

module.exports = router;