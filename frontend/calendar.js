import {Text, Heading} from '@airtable/blocks/ui';
import React from 'react';

async function getOauthToken(userId) {
  const Url='https://api.airtable.com/v0/appVzdOnR4SFUPs9G/oauth?filterByFormula={ID}="'+userId+'"';
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
  const calendarIdRes = await fetch(Url,otherParam).then((res) => res.json()).catch(error=>console.log(error))

  for(var i = 0; i < Object.keys(calendarIdRes.items).length; i++) {
    if (typeof calendarIdRes.items[i].primary !== 'undefined') {
      return calendarIdRes.items[i].id;
    }
  }
} 

async function getTodayEvents(calendarId, oauthToken, selectedDate) {
  var url= new URL('https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events');
  const futureDate = selectedDate.setHours(23,59,59,59); 
  console.log("Selected Date ISO: " + selectedDate.toISOString());
  console.log("Future Date ISO: " + (new Date(futureDate)).toISOString());
  const otherParam={
    method: "GET",
    headers: new Headers({
      'Authorization': "Bearer " + oauthToken,
    }),
  };
  const GETParams = {
    singleEvents: true,
    orderBy: 'startTime',
    timeMin: selectedDate.toISOString(),
    timeMax: (new Date(futureDate)).toISOString(),
  };
  url.search = new URLSearchParams(GETParams).toString();
  let res = await fetch(url,otherParam).then((res)=> res.json()).catch(error=>console.log(error))

  let todayEvents = [];

  if (Object.keys(res.items).length > 0) {
    for(var i=0; i < Object.keys(res.items).length; i++) {
      todayEvents.push(res.items[i]["summary"]);
      if (i == (Object.keys(res.items).length - 1)) {
        return todayEvents;
      }
    }
  }

  return [];
}

export async function IndexCalendar(userId, selectedDate = (new Date(Date.now()))) {
  console.log("the selected date: " + selectedDate.toDateString() + " and the userId: " + userId);
  const oauthTokenRes = await getOauthToken(userId);
  const oauthToken = JSON.stringify(oauthTokenRes["records"][0]["fields"]["oauth-token"]);

  const calendarId = await getCalendarId(oauthToken);

  const eventsRes = await getTodayEvents(calendarId, oauthToken, selectedDate);
  console.log("YOUR EVENTS: " + eventsRes + "for " + selectedDate.toDateString());

  return (
  <div>
    <Heading>Welcome to your calendar</Heading>
    <Text size="xlarge">Today's Events</Text>
    {eventsRes.map(function(name, index){
      return <li key={ index }>{name}</li>;
     })}
  </div>
  )
}