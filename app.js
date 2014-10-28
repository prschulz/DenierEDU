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
  res.send('Hello World');
});


var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});