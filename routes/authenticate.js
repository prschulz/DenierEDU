var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    db = require("../models/index"),
    passport = require('passport'),
    passportLocal = require('passport-local'),
    cookieParser = require('cookie-parser'),
    session = require('cookie-session'),
    flash = require('connect-flash'),
    app = express();

module.exports = function(app){


// app.get('/admin/new', function(req,res){
//   if(!req.user) {
//     res.render("newadmin", { username: ""});
//   }
//   else{
//     res.redirect('/admin');
//   }
// });

app.get('/login', function(req,res){
  // check if the user is logged in
  if(!req.user) {
    res.render("library/login", {message: req.flash('loginMessage'), username: ""});
  }
  else{
    res.redirect('/admin');
  }
});

app.get('/admin', function(req,res){
  res.render("library/admin", {
  //runs a function to see if the user is authenticated - returns true or false
  isAuthenticated: req.isAuthenticated(),
  //this is our data from the DB which we get from deserializing
  admin: req.user
  });
});

// // on submit, create a new users using form values
// app.post('/submit', function(req,res){

//   db.Admin.createNewAdmin(req.body.username, req.body.password,
//   function(err){
//     res.render("library/newadmin", {message: err.message, username: req.body.username});
//   },
//   function(success){
//     res.render("library/login", {message: success.message});
//   });
// });

// authenticate users when logging in - no need for req,res passport does this for us
app.post('/login', passport.authenticate('local', {
  successRedirect: '/admin',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/logout', function(req,res){
  //req.logout added by passport - delete the user id/session
  req.logout();
  res.redirect('/');
});

}; // end of module exports