import { Router } from "express";
import { userModel } from "../dao/models/user.model.js";
import passport from "passport";
import { checkNotLogged } from "../middlewares/auth.js";


const sessionsRoutes = Router();

// Register
sessionsRoutes.post("/register", passport.authenticate('register', {failureRedirect: '/failedRegister'}), async (req, res) => {
  res.redirect('/')
});

// Login
sessionsRoutes.post("/login", passport.authenticate('login', {failureRedirect: '/failedLogin'}), async (req, res) => {
  if(!req.user){
    return res.status(400).send({message: 'error with credentials'})
  }
  req.session.user = {
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    age: req.user.age,
    email: req.user.email
  } 
  res.redirect('/')
});

// Logout
sessionsRoutes.post("/logout", async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error to logout" });
      }
    });
    res.send({ redirect: "http://localhost:8080/login" });
  } catch (error) {
    res.status(400).send({ error });
  }
});

// Github
sessionsRoutes.get('/github', passport.authenticate('github', {scope: ['user:email']}), (req, res) => {

})

//GithubCallback
sessionsRoutes.get('/githubCallback', passport.authenticate('github', {failureRedirect: '/login'}), (req,res) =>{
  req.session.user = req.user;
  res.redirect('/');
})


export default sessionsRoutes;

