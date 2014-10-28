var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    db = require('./models/index');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));








app.get('/', function(req, res){
  db.Politician.findAll({where: {chamber:'house'}, order:'lastname ASC'}).done(function (err,reps) {
    db.Politician.findAll({where: {chamber:'senate'}, order:'lastname ASC'}).done(function(err,senators){
      res.render('home', {allReps: reps, allSenators: senators});
    });
  });
});


var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});