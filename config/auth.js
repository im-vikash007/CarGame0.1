module.exports ={
    ensureAuthenticated: (req,res,next)=>{
      if(req.isAuthenticated()){
         return next();
      }
      req.flash('error_msg','Please login to view this resource');
      res.redirect('/users/login');
    },
    ensureAuthenticated1: (req,res,next)=>{
      if(req.isAuthenticated()){
         return res.redirect('/dashboard');
      }
     // req.flash('error_msg','Please login to view this resource');
     // res.redirect('/users/login');
     next();
    }
}