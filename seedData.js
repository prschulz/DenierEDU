var db = require('./models/index'),
    seed = require('./OFAdata'),
    request = require('request');

// test seed
// console.log(seed[0]);




var sunlight = function (politician, callback) {
  var first_name = politician.firstname,
  last_name = politician.lastname,
  apiKey = "64e52b50c6894c9c85ff4083a347cb84";
  var url = "http://congress.api.sunlightfoundation.com/legislators?first_name="+first_name+"&last_name="+last_name+"&apikey="+apiKey;

  request(url, function (error, response, body) {
    // console.log("request made!");
    // console.log(error);
    if (!error && response.statusCode == 200) {
      var sunlightObj = JSON.parse(body);
      // console.log(sunlightObj);

      //if nothing is returned, use nickname
      if(sunlightObj.count === 0){
        var url = "http://congress.api.sunlightfoundation.com/legislators?nickname="+first_name+"&last_name="+last_name+"&apikey="+apiKey;
        request(url, function (error, response, body){
          console.log("NICKNAME RAN");
          var sunlightObj = JSON.parse(body);
          // console.log(sunlightObj);
          callback(sunlightObj.results[0], politician.id);
        });
      } else{
        callback(sunlightObj.results[0], politician.id);
      }
    } // outer if
  });
};

var updatePoliticianSL = function (results,id) {
  console.log("ID",id);
  db.Politician.find(id).done(function(error,politician){
    politician.updateAttributes({
      chamber: results.chamber,
      state: results.state,
      party: results.party,
      district: results.district,
      title: results.title,
      crp_id: results.crp_id,
      bioguide_id: results.bioguide_id,
      website: results.website,
      contact_form: results.contact_form,
      twitter_id: results.twitter_id,
      facebook_id: results.facebook_id,
      picture: "http://theunitedstates.io/images/congress/225x275/"+results.bioguide_id
    }).success(function(){}); //end updateAttributes
  }); //end done on Politician
};//end updatePolitician function

// var politician = seed[0];
// sunlight(politician, updatePolitician);

//edge case for nickname
// var politician = seed[96];
// sunlight(politician,updatePolitician);


db.Politician.findOrCreate({where: {
  firstname: seed[0].firstname,
  lastname: seed[0].lastname,
  quote: seed[0].denierstatement,
  quote_source: seed[0].denierquoteurl
},
defaults: {
  firstname: seed[0].firstname,
  lastname: seed[0].lastname,
  quote: seed[0].denierstatement,
  quote_source: seed[0].denierquoteurl
}
}).done(function(error,politician){
  if(error){console.log(error);
  } else {
    // console.log(politician);
    // console.log("POLITICIAN NAME:",politician[0].firstname);
    sunlight(politician[0], updatePoliticianSL);
    console.log(politician[0]);
  }
  });



