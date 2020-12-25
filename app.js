const express= require('express');
const expressLayouts= require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session =require('express-session');
const passport= require('passport');
const app= express();
const path=require('path');
const bodyParser=require('body-parser');
app.use('/public',express.static('public'));
app.use('/public',express.static('public'));
app.use(express.json());
//Passport config
require('./config/passport')(passport);

//DB config
const db=require('./config/key').mongoURI;


//Connect to Mongo
mongoose.connect(db,{useNewUrlParser:true})
.then(()=>{
    console.log('MongoDB connected..');
})
.catch(err => {
    console.log(err);
})


//EJS
app.use(expressLayouts);
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));
//Bodyparser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.urlencoded({extended:false}));

//Express session middleware
 app.use(session({
     secret:'secret',
     resave:true,
     saveUninitialized:true
 }));

 //Passport middleware

app.use(passport.initialize());
app.use(passport.session());

 //Connect falsh
 app.use(flash());

 //Global Vars
 app.use((req,res,next)=>{
     res.locals.success_msg=req.flash('success_msg'); //defining flash msg
     res.locals.error_msg=req.flash('error_msg'); //defining flash msg
     res.locals.error=req.flash('error'); //defining flash msg
     next();
 })
//Routes
app.use("/",require('./routes/index'));
app.use("/users",require('./routes/users'));


const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
     console.log(
         `server is started on port ${PORT}`
     );
});