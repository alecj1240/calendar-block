import {initializeBlock, Text} from '@airtable/blocks/ui';
import {session} from '@airtable/blocks';
import React from 'react';
import LoginScreen from './loginScreen.js';
import {IsUserLoggedIn} from './logic.js';
import IndexCalendar from './calendar.js';

require('dotenv').config('../.env')

const currentUserId = session.currentUser.id;

async function LoadPages() {
  let isUserLoggedIn = IsUserLoggedIn(currentUserId);
  let result = await isUserLoggedIn;

  if (result == true) {
    console.log("GOING TO RETURN IN HERE")
    const CalendarPage = await IndexCalendar(currentUserId);
    return CalendarPage;
  } else {
    return <LoginScreen />;
  } 
}

LoadPages().then((result) => {
  initializeBlock(() => result);
})

