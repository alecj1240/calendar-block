import {initializeBlock, Text} from '@airtable/blocks/ui';
import {session} from '@airtable/blocks';
import React from 'react';
import LoginScreen from './loginScreen.js';
import {IsUserLoggedIn} from './logic.js';
import IndexCalendar from './calendar.js';

require('dotenv').config('../.env')

const currentUserId = session.currentUser.id;
let isUserLoggedIn = IsUserLoggedIn(currentUserId);

isUserLoggedIn.then(function(result) {
  const HelloWorldBlock = () => {
    if (result == true) {
      return <IndexCalendar userId={currentUserId} />;
    } else {
      return <LoginScreen />;
    }
  }
  initializeBlock(() => <HelloWorldBlock />);
});
