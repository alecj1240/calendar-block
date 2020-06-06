import {Text} from '@airtable/blocks/ui';
import {session} from '@airtable/blocks';
import React from 'react';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getUserOauthToken(userId) {
  var Airtable = require('airtable');
  var base = new Airtable({apiKey:'keyv18eQNXnUD0Mdn'}).base('appVzdOnR4SFUPs9G');  
  var user = {};

  base('oauth').select({
    filterByFormula:'{ID}="'+userId+'"'
  }).firstPage(function(err, records) {
    if (err) { console.error(err); return; }
    if (typeof records[0] !== 'undefined') {
      user.oauthToken = records[0].get('oauth-token');
    }
  });

  await sleep(750);

  return user.oauthToken;
}

async function getPrimaryCalendarId(oauthToken) {
  var result;
  const Url='https://www.googleapis.com/calendar/v3/users/me/calendarList';
  const otherParam={
    method : "GET",
    headers: new Headers({
      'Authorization': "Bearer " + oauthToken,
    })
  };
  fetch(Url,otherParam)
  .then((res) => res.json()).then(function(data){
    var i;
    for(i = 0; i < Object.keys(data.items).length; i++) {
      if (typeof data.items[i].primary !== 'undefined') {
        result = data.items[i].id;
      }
    }
  }).catch(error=>console.log(error))

  await sleep(750);

  return result;
}

function getEvents(calendarId) {
  const Url='https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events';
  const Data=JSON.stringify({
    //client_id: process.env.REACT_APP_CLIENT_ID,
  });
  const otherParam={
    body:Data,
    method: "POST"
  };
  fetch(Url,otherParam)
  .then((res)=> res.json()).then(function(data){
    // "oauth-token": data.access_token,       
  }).catch(error=>console.log(error))

}

export default function IndexCalendar({
  userId
}) {
  getUserOauthToken(userId).then(function(token) {
    getPrimaryCalendarId(token).then(function(primaryId) {
      console.log("THE PRIMARY ID IS " + primaryId)
      return (
        <Text>Welcome to your calendar</Text>
      )
    });
  });
}