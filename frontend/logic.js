require('dotenv').config('../.env')

// determine if the user is logged in
export async function IsUserLoggedIn(userId) {
  var user = {loggedIn: false};

  const Url='https://api.airtable.com/v0/appVzdOnR4SFUPs9G/oauth?filterByFormula={ID}="'+userId+'"';
  const otherParam={
    method: "GET",
    headers: new Headers({
      'Authorization': "Bearer keyv18eQNXnUD0Mdn",
    })
  }
  let res = await fetch(Url,otherParam).then((res) => res.json());

  if (typeof res["records"][0] !== 'undefined') {
    user.refreshToken = res["records"][0]["fields"]["refresh-token"];
    user.timestamp = res["records"][0]["fields"]["expires_at"];
    user.recordId =  res["records"][0]["id"];
  }

  if (typeof user.refreshToken !== 'undefined') {
    if (Date.now() < user.timestamp) {
      user.loggedIn = true;
      return user.loggedIn;
    } else {
      var isTokenRefreshed = refreshAuthToken(user.refreshToken, user.recordId);         
      if (isTokenRefreshed == true) {
        user.loggedIn = true;
        return user.loggedIn;
      }
    }
  }

  return user.loggedIn;
}

// update auth token with the refresh token
async function refreshAuthToken(refreshToken, recordId) {
  const url='https://oauth2.googleapis.com/token';
  const formData=JSON.stringify({ 
    'refresh_token': refreshToken,
    'client_id': '104634558751-1ti20v7urgs8r8cdcg36n67atp0sejin.apps.googleusercontent.com',
    'client_secret': 'Tm-ImPRgwADm2a7ZJV-JzAWQ',
    'grant_type': "refresh_token"
  });

  const res = await fetch(url,{
    method: 'POST',
    body: formData
  }).then((data)=> data.json())

  const newUrl='https://api.airtable.com/v0/appVzdOnR4SFUPs9G/oauth';
  const Body=JSON.stringify({
    "records": [
      {
        "id":recordId,
        "fields": {
          "oauth-token": res["access_token"],
          "expires_at": (res["expires_in"] * 1000) + Date.now()
        }
      }
    ]
  });
  const newParam={
    method: "PATCH",
    headers: new Headers({
      'Authorization': "Bearer keyv18eQNXnUD0Mdn",
      'Content-Type': "application/json"
    }),
    body: Body
  }

  const airtableRes = await fetch(newUrl,newParam).then((data)=> data.json())

  const newTimestamp = JSON.stringify(airtableRes["records"][0]["fields"]["expires_at"]) ? JSON.stringify(airtableRes["records"][0]["fields"]["expires_at"]) : '';

  if (newTimestamp > Date.now()) {
    return true;
  } else {
    return false;
  }
}