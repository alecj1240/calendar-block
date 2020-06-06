require('dotenv').config('../.env')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// determine if the user is logged in
export async function IsUserLoggedIn(userId) {
  var Airtable = require('airtable');
  var base = new Airtable({apiKey:'keyv18eQNXnUD0Mdn'}).base('appVzdOnR4SFUPs9G');  
  var user = {loggedIn: false};

  base('oauth').select({
    filterByFormula:'{ID}="'+userId+'"'
  }).firstPage(function(err, records) {
    if (err) { console.error(err); return false; }
    if (typeof records[0] !== 'undefined') {
      user.timestamp = records[0].get('expires_at');
      user.recordId = records[0].getId();
      user.refreshToken = records[0].get('refresh-token');
    }
  });

  await sleep(750);

  if (typeof user.refreshToken !== 'undefined') {
    if (Date.now() < user.timestamp) {
      user.loggedIn = true;
    } else {
      var isTokenRefreshed = refreshAuthToken(user.refreshToken, user.recordId); 
      if (isTokenRefreshed == true) {
        user.loggedIn = true;
      }
    }
  }

  return user.loggedIn;
}

// update auth token with the refresh token
function refreshAuthToken(refreshToken, recordId) {
var Airtable = require('airtable');
var base = new Airtable({apiKey:'keyv18eQNXnUD0Mdn'}).base('appVzdOnR4SFUPs9G');  

const Url='https://oauth2.googleapis.com/token';
  const Data=JSON.stringify({
    refresh_token: refreshToken,
    client_id: '104634558751-1ti20v7urgs8r8cdcg36n67atp0sejin.apps.googleusercontent.com',
    client_secret: 'Tm-ImPRgwADm2a7ZJV-JzAWQ',
    grant_type: "refresh_token"
  });
  const otherParam={
    body:Data,
    method: "POST"
  };
  fetch(Url,otherParam)
  .then((res)=> res.json()).then(function(data){
    if(typeof data.access_token !== 'undefined') {
      base('oauth').update([
        {
          "id": recordId,
          "fields": {
            "oauth-token": data.access_token,
            "expires_at": (data.expires_in * 1000) + Date.now()
          }
        }
      ], function(err, records) {
        if (err) {
          console.error(err);
          return false;
        }
      });    
    } 
  }).catch(error=>console.log(error))
  return true;
}

// determine if the user is on a selected date or on an email