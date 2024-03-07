import passport from 'passport';
import local from 'passport-local';
import { userModel } from '../dao/models/user.model.js';
import { createHash, isValidPassword } from '../utils/bcrypt.js';
import { Strategy as GithubStrategy } from 'passport-github2';

const localStrategy = local.Strategy

const initializePassport = () => {

    // Register
    passport.use('register', new localStrategy(
        {passReqToCallback: true, usernameField: 'email'},
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                const user = await userModel.findOne({email: username})
                if (user) {
                    console.log('user already exists');
                    return done(null,false);
                }
                const newUser = {
                    first_name, last_name, email, age, password: createHash(password)
                }
                const result = await userModel.create(newUser);
                return done(null,result);
            } catch (error) {
                return done('Error to obtain the user' + error)
            }
        }
    ))

    // Login
    passport.use('login', new localStrategy(
        {usernameField: 'email'},
        async (username, password, done) => {
            try {
                const user = await userModel.findOne({email: username})
                if(!user){
                    console.log("user doesnt exist")
                    done(null,false)
                }
                if(!isValidPassword(user,password)){
                    return done(null,false)
                }
                return done(null, user)
            } catch (error) {
                return done(error);
            }
        }
    ))

    //  Github
    passport.use('github', new GithubStrategy(
        {
            clientID: 'Iv1.5355354b13266dc0',
            callbackURL: '/api/sessions/githubCallback',
            clientSecret: '568c85ae217d7998fd574aae4b7c36fa7d2209fd'
        },
        async (accessToken, refreshToken, profile, done) =>{
            try {
                const user = await userModel.findOne({email: profile._json.email});
                if (!user){
                    const newUser = {
                        first_name: profile._json.name.split(' ')[0],
                        last_name: profile._json.name.split(' ')[1],
                        age: 18,
                        email: profile._json.email,
                        password: '***'
                    }
                    const result = await userModel.create(newUser)
                    done(null,result);
                }
                return done(null,user);
            } catch (error) {
                return done(error);
            }
        }
    ))

    // Serialize
    passport.serializeUser((user, done) =>{
        done(null,user._id);
    })

    // Deserialize
    passport.deserializeUser(async (id, done) =>{
        const user = await userModel.findOne({_id: id})
        done(null,user);
    })
}

export default initializePassport;