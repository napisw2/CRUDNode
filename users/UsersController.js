const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require('bcryptjs');
const Toastify = require('toastify-js');

router.get("/admin/users",(req,res)=>{ 
    User.findAll().then(users =>{
        res.render("admin/users/index",{users:users});
    });
});

router.get("/admin/users/create",(req,res)=>{
    res.render("admin/users/create",{message:null});
});

router.post("/users/create",(req,res)=>{
    var email = req.body.email;
    var password = req.body.password;
    
    User.findOne({where:{ email:email}}).then(user =>{
        if(user == undefined){

            var salt = bcrypt.genSaltSync(10);  //preparando o hash,aumentando a segurança dele
            var hash = bcrypt.hashSync(password,salt);             //gerando hash da senha
        
            User.create({
                email:email,
                password: hash     //assim teremos segurança nas senhas
            }).then(()=>{
                res.redirect("/")
            }).catch(error=>{
                res.redirect("/")
            });
        }else{         
            res.render("admin/users/create",{message:0}); 
        }
    });
    
});

router.get("/login",(req,res)=>{
    res.render("admin/users/login");
});

router.post("/authenticate",(req,res)=>{
    var email = req.body.email;
    var password = req.body.password;
    
    User.findOne({where:{email:email}}).then(user=>{
        if(user != undefined){
            var correct = bcrypt.compareSync(password,user.password); //comparando a senha "password" com a senha do banco de dados "user.password"
            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                
                res.redirect("/admin/articles");
            }else{          
                 
                res.redirect("/login");
            }
        }else{          
            res.redirect("/login");
        }
    })

});

router.get("/logout",(req,res)=>{
    req.session.user = undefined;
    res.redirect("/");
});

module.exports = router;