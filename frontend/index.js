import {initializeBlock, Text} from '@airtable/blocks/ui';
import {session} from '@airtable/blocks';
import React from 'react';
import LoginScreen from './loginScreen.js';
import {IsUserLoggedIn} from './logic.js';
import IndexCalendar from './calendar.js';

require('dotenv').config('../.env')

const currentUserId = session.currentUser.id;

async function LoadPages() {
  let isUserLoggedIn = await IsUserLoggedIn(currentUserId);
  if (isUserLoggedIn == false) {
    return <LoginScreen />;
  }

  const CalendarPage = await IndexCalendar(currentUserId);
  return CalendarPage;
}

LoadPages().then((result) => {
  initializeBlock(() => result);
})

