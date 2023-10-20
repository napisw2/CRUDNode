const express = require("express");
const router = express.Router();                   //objeto utilizado para criar rotas
const Category = require('./Category');
const slugify = require("slugify");  //aqui estamos adicionando a biblioteca de slug,que faz a troca de espaço por - e a troca de letra maiuscula por minuscula
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/categories/new",adminAuth,(req,res)=>{
    res.render("admin/categories/new");
});


router.post("/categories/save",(req,res)=>{
    var title = req.body.title;
    if(title != undefined){
        Category.create({
            title: title,
            slug:slugify(title)
        }).then(()=>{
            res.redirect("/admin/categories");
        })
    }else{
        res.redirect("/admin/categories/new");
    }
});
 
router.get("/admin/categories",adminAuth,(req,res) => {
    Category.findAll().then(categories => {
        res.render("admin/categories/index",{categories: categories});       
    });
});

router.post("/categories/delete",adminAuth,(req,res)=>{
   var id = req.body.id;
   if( id != undefined ){
        if(!isNaN(id)){    //isNaN utilizado para ver se o valor não é número(int) , ou seja : !isNAN= é um numero
            Category.destroy({
                where:{
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/categories");
            });
        }else{ //caso id nao seja um numero
            res.redirect("/admin/categories");
        }
    }else{     //caso id seja null
        res.redirect("/admin/categories");
    }     
});
// ABAIXO TEREMOS A EDICAO :
router.get("/admin/categories/edit/:id",adminAuth,(req,res) => {
    var id = req.params.id; 
    if(isNaN(id)){    //isNaN utilizado para ver se o valor não é número(int) , ou seja : !isNAN= é um numero
        res.redirect("/admin/categories");
    }
    Category.findByPk(id).then(category => {       //findbypk: pesquisa uma categoria pelo seu id.
        if(category != undefined){
            res.render("admin/categories/edit",{category:category});
        }else{
            res.redirect("/admin/categories");
        }
    }).catch(erro => {
        res.redirect("/admin/categories");
    })
});

router.post("/categories/update",adminAuth,(req,res)=>{
    var id = req.body.id;
    var title = req.body.title;
    
    Category.update({title:title, slug:slugify(title)},{ //o 1 title se refere ao titulo da coluna,o segundo se refere ã variavel que acabou de ser criada que vai carregar o novo titulo, o mesmo acontece com o slug.
        where:{
            id: id
        }
    }).then(()=>{
        res.redirect("/admin/categories")
    })
    
});

module.exports = router;
