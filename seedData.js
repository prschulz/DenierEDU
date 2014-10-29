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
      openSecrets(politician,updatePoliticianOS);

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
  db.Politician.find(id).done(function (err, politician) {
    var politicianObj = {};
    results.response.industries.industry.forEach(function(data,i){
      //variables to help in creation
      var attr = data['@attributes'];

      //seed Politician table with top 3 industries
       if(i<3){
        politicianObj["industry" + (i+1) + "_name"] = attr.industry_name;
        politicianObj["industry" + (i+1) + "_total"] = attr.total;
        // console.log(obj);
      } //end if

      var indName = {name:attr.industry_name};
      db.Industry.findOrCreate({where:indName, defaults:indName}) // find or create industry based on name
      .done(function(error,industry){
        var ipAtts = {PoliticianId: politician.id, IndustryId: industry[0].id}; //variable to help findOrCreate below it
        db.IndustriesPoliticians.findOrCreate({where:ipAtts, defaults:ipAtts}) //end industriesPoliticians find or create
        .done(function(error,industrypolitician){  //done to update amount for given politician. Separate to allow for updating.
          industrypolitician[0].updateAttributes({
            amount: attr.total
          });//end updateAttributes
        });//end of 2nd done
      }); //end of 1st done
    });//end of forEach
  politician.updateAttributes(politicianObj).success(function() {}); //load industry values into Politician table
  });//end of Politician.find
};//end of updatePoliticianOS function

//--------------DATABASE SEEDING---------------//

// for (var i = 0; i < seed.length; i++) {
  //storing ofaData for findOrCreate
  var ofa = {firstname: seed[0].firstname,
    lastname: seed[0].lastname,
    quote: seed[0].denierstatement,
    quote_source: seed[0].denierquoteurl};

  db.Politician.findOrCreate({where: ofa, defaults: ofa}) // findOrCreate on OFA data
  .done(function(error,politician){
    if(error){console.log(error);}
    else {
      sunlight(politician[0], updatePoliticianSL); //calling sunlight foundation API and callback with nested openSecrets API call
    }
  });//end done function
// } //end loop


