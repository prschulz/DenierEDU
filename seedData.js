var db = require('./models/index'),
    seed = require('./OFAdata'),
    request = require('request');


var seedDataWrapper = {

//--------Sunlight API functions---------//
sunlight: function (politician, callback) {
  var first_name = politician.firstname,
  last_name = politician.lastname,
  apiKey = process.env.SUNLIGHT_KEY;
  var url = "http://congress.api.sunlightfoundation.com/legislators?first_name="+first_name+"&last_name="+last_name+"&apikey="+apiKey;

  request(url, function (error, response, body) {
    // console.log("request made!");
    // console.log(error);
    if (!error && response.statusCode == 200) {
      var sunlightObj = JSON.parse(body);

      //if nothing is returned, use nickname
      if(sunlightObj.count === 0){
        var url = "http://congress.api.sunlightfoundation.com/legislators?nickname="+first_name+"&last_name="+last_name+"&apikey="+apiKey;
        request(url, function (error, response, body){
          console.log("NICKNAME RAN");
          var sunlightObj = JSON.parse(body);

              //if nothing is returned, use middlename
              if(sunlightObj.count === 0){
                var url = "http://congress.api.sunlightfoundation.com/legislators?middle_name="+first_name+"&last_name="+last_name+"&apikey="+apiKey;
                request(url, function (error, response, body){
                  console.log("MIDDLENAME RAN");
                  var sunlightObj = JSON.parse(body);
                  callback(sunlightObj.results[0], politician.id); //callback on middlename
                });//end of request function on middlename
              } else{
              callback(sunlightObj.results[0], politician.id); //callback on nickname
            }
        });//end of request function on nickname
      } else{
        callback(sunlightObj.results[0], politician.id); //callback on firstname
      }//end else for firstname
    } // outer if
  }); //end of request function on firstname
},//end of function

// ^ = callback hell

updatePoliticianSL: function (results,id) {
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
      picture: "http://theunitedstates.io/images/congress/225x275/"+results.bioguide_id+".jpg"
    }).success(function(politician){

      //Calling Open Secrets API
      seedDataWrapper.openSecrets(politician,seedDataWrapper.updatePoliticianOS);

    }); //end success function for Open Secrets
  }); //end done on Politician
},//end updatePolitician function


//--------Open Secrets API functions---------//

openSecrets: function (politician, callback) {
  var cid = politician.crp_id,
  cycle = 2014,
  apiKey = process.env.OPENSECRETS_KEY;
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
},//end openSecrets function

updatePoliticianOS: function (results,id) {
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
},//end of updatePoliticianOS function



//--------------DATABASE SEEDING---------------//
seedDatabase: function(){
// for (var i = 0; i < seed.length; i++) {
  //storing ofaData for findOrCreate
  var ofa = {firstname: seed[i].firstname,
    lastname: seed[i].lastname,
    quote: seed[i].denierstatement,
    quote_source: seed[i].denierquoteurl};

  db.Politician.findOrCreate({where: ofa, defaults: ofa}) // findOrCreate on OFA data
  .done(function(error,politician){
    if(error){console.log(error);}
    else {
      seedDataWrapper.sunlight(politician[0], seedDataWrapper.updatePoliticianSL); //calling sunlight foundation API and callback with nested openSecrets API call
    }
  });//end done function
// } //end loop
}
};

module.exports=seedDataWrapper;
