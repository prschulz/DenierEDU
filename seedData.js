var db = require('./models/index'),
    seed = require('./OFAdata'),
    request = require('request');


//--------Sunlight API functions---------//

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
      oc_email: results.oc_email,
      picture: "http://theunitedstates.io/images/congress/225x275/"+results.bioguide_id
    }).success(function(politician){

//Calling Open Secrets API
      // openSecrets(politician,updatePoliticianOS);

    }); //end success function for Open Secrets
  }); //end done on Politician
};//end updatePolitician function

// var politician = seed[0];
// sunlight(politician, updatePoliticianSL);

// //edge case for nickname
// var politician = seed[96];
// sunlight(politician,updatePoliticianSL);

//--------Open Secrets API functions---------//

var openSecrets = function (politician, callback) {
  var cid = politician.crp_id,
  cycle = 2014,
  apiKey = "0aef7eebeabf36223930da190ee29d8a";
  var url = "http://www.opensecrets.org/api/?method=candIndustry&cid="+cid+"&cycle="+cycle+"&output=json&apikey="+apiKey;

  request(url, function (error, response, body) {
    // console.log("request made!");
    // console.log(error);
    if (!error && response.statusCode == 200) {
      var openSecretsObj = JSON.parse(body);
      // console.log(openSecretsObj);

      callback(openSecretsObj, politician.id);
      }//end if
  });//end request
};//end openSecrets function

var updatePoliticianOS = function (results,id) {
  // var goodies = []
  db.Politician.find(id).done(function (err, politician) {
    var obj = {};
    results.response.industries.industry.forEach(function(data,i){
      var attr = data['@attributes'];
      // if(index<3) goodies.push(data['@attributes']);
      if(i<3){
        obj["industry" + (i+1) + "_name"] = attr.industry_name;
        obj["industry" + (i+1) + "_total"] = attr.total;
        // console.log(obj);
      }
    });
    politician.updateAttributes(obj).success(function() {});
  });
};

//--------------DATABASE SEEDING---------------//

for (var i = 0; i < seed.length; i++) {

db.Politician.findOrCreate({where: {
  firstname: seed[i].firstname,
  lastname: seed[i].lastname,
  quote: seed[i].denierstatement,
  quote_source: seed[i].denierquoteurl
},
defaults: {
  firstname: seed[i].firstname,
  lastname: seed[i].lastname,
  quote: seed[i].denierstatement,
  quote_source: seed[i].denierquoteurl
}
}).done(function(error,politician){
  if(error){console.log(error);
  } else {
    //calling sunlight foundation API and callback with nested openSecrets API call
    sunlight(politician[0], updatePoliticianSL);
  }
  });
};



