const express =require('express');
const router= express.Router();
const bcrypt=require('bcryptjs');
const passport=require('passport');
//User model
const User= require('../models/User');
const { response } = require('express');

//homepage of user
// router.get('/',(req,res)=>{
//     res.send('Welcome  to home page');
// });

//login page
router.get('/login',(req,res)=>{
    res.render('login');
});

//registration page
router.get('/register',(req,res)=>{
    res.render('register');
});

//Register Handle
router.post('/register',(req,res)=>{
    //   console.log(req.body);
    //   console.log('hi there');
    //   res.send(req.body);
    
    const {name,email,password,password2}=req.body;
    let errors=[];
    //Check required fields
    if(!name || !email || !password || !password2){
        errors.push({msg:"Please fill in all fields"});
    }

    //Check passwords match
    if(password !=password2){
        errors.push({msg:"Password do not match"});
    }
    //Check pass length
    if(password.length<5){
        errors.push({msg:'Password should be at least 5 characters'});
    }
    if(errors.length>0){
        res.render('register',{
            errors,
            name,
            email,
            password, 
            password2    
        })
    } 
    else{
         //Validation passed
         User.findOne({email:email})
         .then(user=>{
             if(user){
                 //user exists
                 errors.push({msg:'Email is already registred!'});
                res.render('register',{
                    errors,
                    name,
                    email,
                    password, 
                    password2    
                })
             }
             else{
                 const newUser = new User({ //creating instance
                     name,
                     email,
                     password
                 });
                 //Hash Password
                  bcrypt.genSalt(10,(err,salt)=>{
                     bcrypt.hash(newUser.password,salt,(err,hash)=>{
                         if(err) throw err;
                         //Set password to hashed
                         newUser.password=hash;
                         newUser.highScore=0;
                         //Save user
                         newUser.save()
                         .then(user =>{
                             req.flash('success_msg','You are now registered and can login');//creating flash msg
                             res.redirect('/users/login');
                         })
                          .catch(err => console.log(err));
                     })
                 });
             }
         })

    }
});

//Login handle
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);
});

//Logout handle
router.get('/logout',(req,res)=>{
    req.logout();//passport method for logout
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
})

module.exports= router;