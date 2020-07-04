import {Heading, Box, Link, Icon, Dialog, Input} from '@airtable/blocks/ui';
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

function addTimeZoneToDate(theDate) {
  // theDate should be an ISO string
  var newDate = theDate;
  newDate = newDate.substring(0, newDate.length - 1);
  var timeZoneOffset = (new Date()).getTimezoneOffset();
  if (timeZoneOffset > 0) {
    var direction = "-"
  } else {
    var direction = "+"
  }
  if ((timeZoneOffset/60) < 10 ) {
    var floatingZero = "0";
  } else {
    var floatingZero = "";
  }
  newDate = newDate + direction + floatingZero + (timeZoneOffset/60).toString() + ":00";
  return newDate;
}

function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

async function getTodayEvents(calendarId, oauthToken, selectedDate) {
  var url= new URL('https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events');
  const futureDate = (new Date(selectedDate));
  futureDate.setDate(futureDate.getDate() + 1);
  const otherParam={
    method: "GET",
    headers: new Headers({
      'Authorization': "Bearer " + oauthToken,
    }),
  };
  const GETParams = {
    singleEvents: true,
    orderBy: 'startTime',
    timeMin: addTimeZoneToDate((new Date(selectedDate)).toISOString()),
    timeMax: addTimeZoneToDate((new Date(futureDate)).toISOString()),
  };
  url.search = new URLSearchParams(GETParams).toString();
  let res = await fetch(url,otherParam).then((res)=> res.json()).catch(error=>console.log(error))

  let todayEvents = [];

  if (Object.keys(res.items).length > 0) {
    for(var i=0; i < Object.keys(res.items).length; i++) {
      var newEvent = [];
      newEvent.push(res.items[i]["summary"], res.items[i]["start"]["dateTime"], res.items[i]["htmlLink"]);
      todayEvents.push(newEvent);
      if (i == (Object.keys(res.items).length - 1)) {
        return todayEvents;
      }
    }
  }

  return [];
}

export async function IndexCalendar(userId, selectedDate = {}) {
  if (typeof selectedDate == 'object') {
    selectedDate = (new Date(Date.now()))
    selectedDate = selectedDate.setMinutes(selectedDate.getMinutes() - (new Date()).getTimezoneOffset());
  }

  const oauthTokenRes = await getOauthToken(userId);
  const oauthToken = JSON.stringify(oauthTokenRes["records"][0]["fields"]["oauth-token"]);
  const calendarId = await getCalendarId(oauthToken);
  const eventsRes = await getTodayEvents(calendarId, oauthToken, selectedDate);
  const displayString = (new Date(addTimeZoneToDate((new Date(selectedDate)).toISOString()))).toDateString();

  var counter = 0;

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        backgroundColor="white"
        borderRadius="none"
        paddingTop={1}
        overflow="hidden"
        border="default"
      >
        <Heading size="xlarge">{displayString}</Heading>
      </Box>
      {eventsRes.map(function(event){
        counter += 1;
        var backgroundColor = "white";
        if (counter % 2 == 0) {
          var backgroundColor = "lightGray1"
        }
        var eventDate = (new Date(Date.parse(event[1])));
        var displayString = eventDate.getHours() + ":" + checkTime(eventDate.getMinutes())
        if (Number.isNaN(eventDate.getHours())) {
          displayString = "";
        }
        return (
          <div>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              backgroundColor={backgroundColor}
              borderRadius="large"
              padding={2}
              overflow="hidden"
            >
              <Link href={event[2]} target="_blank">
                <Icon name="calendar" size={12} marginRight={1}/>
                <Heading size="xsmall" marginRight={2} textColor="grey"> {displayString} </Heading>
                <Heading size="default"> {event[0]} </Heading>
              </Link>
            </Box>
          </div>
        );
        })}
    </div>
  )
}

