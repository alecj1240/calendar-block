import {Text} from '@airtable/blocks/ui';
import React from 'react';

// function getEvents(calendarId) {
//   const Url='https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events';
//   const Data=JSON.stringify({
//     //client_id: process.env.REACT_APP_CLIENT_ID,
//   });
//   const otherParam={
//     body:Data,
//     method: "POST"
//   };
//   fetch(Url,otherParam)
//   .then((res)=> res.json()).then(function(data){
//     // "oauth-token": data.access_token,       
//   }).catch(error=>console.log(error))

// }
//  if (typeof records[0] !== 'undefined') {
//   return records[0].get('oauth-token');
// }


async function getOauthToken(userId) {
  const Url='https://api.airtable.com/v0/appVzdOnR4SFUPs9G/oauth?filterByFormula={ID}="'+userId+'"';
  console.log("URL IS: " + Url)
  const otherParam={
    method: "GET",
    headers: new Headers({
      'Authorization': "Bearer keyv18eQNXnUD0Mdn",
    })
  }
  let res = await fetch(Url,otherParam).then((res) => res.json());
  return res;
}

async function getCalendarId(oauthToken) {
  const Url='https://www.googleapis.com/calendar/v3/users/me/calendarList';
  const otherParam={
    method : "GET",
    headers: new Headers({
      'Authorization': "Bearer " + oauthToken,
    })
  };
  let res = await fetch(Url,otherParam).then((res) => res.json()).catch(error=>console.log(error))
  return res;
}

export default async function IndexCalendar(userId) {
  const oauthTokenRes = await getOauthToken(userId);
  const oauthToken = JSON.stringify(oauthTokenRes["records"][0]["fields"]["oauth-token"]);

  const calendarIdRes = await getCalendarId(oauthToken);
  for(var i = 0; i < Object.keys(calendarIdRes.items).length; i++) {
    if (typeof calendarIdRes.items[i].primary !== 'undefined') {
      let calendarId = calendarIdRes.items[i].id;
      console.log("found the calendar id: " + calendarId);
    }
  };

  return (
  <Text>Welcome to your calendar</Text>
  )
}