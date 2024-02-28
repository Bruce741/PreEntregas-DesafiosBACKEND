export const checkLogged = (req,res, next) =>{
    if(!req.session.user){
        return res.redirect("/login")
    }
    next();
}

export const checkExistingUser = (req, res, next) =>{
    if(req.session.user) {
        return res.redirect("/products")
    }
    next();
}