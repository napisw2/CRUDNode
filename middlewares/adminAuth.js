function adminAuth(req,res,next){   //next serve para dar continuidade na requisição,sem ele n dá pra passar pra rota
    if(req.session.user != undefined){
        next();
    }else{
        res.redirect("/login");
    }                   
}
module.exports = adminAuth;