var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    passport = require('passport'),
    passportLocal = require('passport-local'),
    cookieParser = require('cookie-parser'),
    session = require('cookie-session'),
    flash = require('connect-flash'),
    seed = require('./OFAdata'),
    seedDataWrapper = require('./seedData'),
    db = require('./models/index');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

//set up our session
app.use(session({
  secret: 'secretkey',
  name: 'chocolate chip',
//this is in milliseconds
  maxage: 3600000
}));

//get passport started
app.use(passport.initialize());
app.use(passport.session());

//include flash messages
app.use(flash());

//let's serialize a admin if authenticated successfully
passport.serializeUser(function(admin,done){
  console.log("SERIALIZED JUST RAN");
  done(null,admin.id);
});

passport.deserializeUser(function (id,done) {
  console.log("DESERIALIZED JUST RAN");
  db.Admin.find({
    where: {
      id: id
    }
  }).done(function (error,user) {
    done(error,user);
  });
});

app.post("/refresh",function(req,res){
  seedDataWrapper.seedDatabase();
  res.redirect('/admin');
});

//authentication routes for admin in routes/authenticate.js
require('./routes/authenticate')(app);

//-------function for grabbing search-------//


//-------routes-------//

//home
app.get('/', function(req, res){
  db.Politician.findAll({where: {chamber:'house'},order:'lastname ASC', include: [db.IndustriesPoliticians]}).done(function (err,reps) {
    db.Politician.findAll({where: {chamber:'senate'}, order:'lastname ASC'}).done(function(err,senators){
      db.sequelize.query('SELECT DISTINCT state FROM "Politicians" ORDER BY state ASC').success(function (states) {
        var stateNames = states.map(function(elem){
          if(elem.state != null && elem.state !== undefined)
            return elem.state;
        });

        res.render('home', {allReps: reps, allSenators: senators, allStates:stateNames});
      });//end state query
    });//end senate findall
  }); //end house findall
});//end home route

app.get('/search', function (req, res) {
  var state = req.query.state;

  db.Politician.findAll({where: {chamber:'house', state:state},order:'lastname ASC', include: [db.IndustriesPoliticians]}).done(function (err,reps) {
    db.Politician.findAll({where: {chamber:'senate', state:state}, order:'lastname ASC'}).done(function(err,senators){
      db.sequelize.query('SELECT DISTINCT state FROM "Politicians" ORDER BY state ASC').success(function (states) {
        var stateNames = states.map(function(elem){
          if(elem.state != null && elem.state !== undefined)
            return elem.state;
        });

        res.render('home', {allReps: reps, allSenators: senators, allStates:stateNames, state:state});
      });//end state query
    });//end senate findall
  }); //end house findall}
});//end search route



var server = app.listen(process.env.PORT || 3000, function() {
    console.log('Listening on port %d', server.address().port);
});