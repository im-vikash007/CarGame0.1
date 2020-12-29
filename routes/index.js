const express =require('express');
const router= express.Router();
let path = require('path');
const User= require('../models/User');
const {ensureAuthenticated,ensureAuthenticated1}=require('../config/auth');
const { runInNewContext } = require('vm');

//Welcome Page
router.get('/',ensureAuthenticated1,(req,res)=>{
   res.render('welcome');
 //  console.log('rendering to welcome page')
});

//Dashboard
router.get('/dashboard',ensureAuthenticated,(req,res)=>{
  //  console.log(req.body);
  //  console.log('authentication passed');
   res.render('game',{
    user:req.user
  });
 // res.sendFile('../views/game.html');

});

router.post('/updateScore',ensureAuthenticated,(req,res)=>{
     console.log('updateScore api called');
     console.log(req.user);
     console.log('body here; ')
     console.log(req.body);
     const score=req.body.score;
     req.user.highScore=score;
     const email=req.user.email;
     console.log(score);
     console.log(email);
     User.findOne({email:email},(err,foundObject)=>{
       if(err){
         console.log(err);
         return;
       }
       foundObject.highScore=score;
       foundObject.save((err,updatedObject)=>{
         console.log(`updated data: ${updatedObject}`);
       });
     });
     res.json({
       status:'success',
       Score:score
     });
});
module.exports= router;

