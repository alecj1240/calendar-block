import {initializeBlock, Text, useLoadable, useWatchable, useBase,} from '@airtable/blocks/ui';
import {session,cursor} from '@airtable/blocks';
import React, {useState, useEffect}from 'react';
import LoginScreen from './loginScreen.js';
import {IsUserLoggedIn, RecordCalendar} from './logic.js';
import {IndexCalendar} from './calendar.js';

require('dotenv').config('../.env')

const currentUserId = session.currentUser.id;
console.log("CURRENT USER ID: " + currentUserId);

const LoadPages = () => {

  const [isUserLoggedIn, setIsUserLoggedIn] = useState('');
  const [calendarPage, setCalendarPage] = useState('');
  const [selectPage, setSelectPage] = useState('');
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [selectedFieldId, setSelectedFieldId] = useState(null);

  const base = useBase();
  const activeTable = base.getTableByIdIfExists(cursor.activeTableId);

  useLoadable(cursor);
  useWatchable(cursor, ['selectedRecordIds', 'selectedFieldIds'], () => {
    if (cursor.selectedRecordIds.length > 0) {
      setSelectedRecordId(cursor.selectedRecordIds[0]);
    }
    if (cursor.selectedFieldIds.length > 0) {
      setSelectedFieldId(cursor.selectedFieldIds[0]);
    }
  });

  useWatchable(cursor, ['activeTableId', 'activeViewId'], () => {
    setSelectedRecordId(null);
    setSelectedFieldId(null);
  });

  // get the code to display the calendar page
  const getCalendarPage = async () => {
    const indexdata = await IndexCalendar(currentUserId);
    setCalendarPage(indexdata)
  }

  // get the code to display the login page
  const getUserLoggedIn = async () => {
    const logindata = await IsUserLoggedIn(currentUserId);
    setIsUserLoggedIn(logindata);
  }

  useEffect(() => {
    if(!calendarPage) {
      getCalendarPage();
    }
  }, [calendarPage]);

  useEffect(() => {
    if(!isUserLoggedIn) {
      getUserLoggedIn();
    }
  }, [isUserLoggedIn]);

  useEffect(() => {
    if(!selectPage) {
      setSelectPage(selectedRecordId);
    }
  }, [selectedRecordId]);

  if(selectPage) {
    return <RecordCalendar activeTable={activeTable} selectedRecordId={selectedRecordId} selectedFieldId={selectedFieldId}/>
  }

  if(calendarPage) {
    return calendarPage;
  }

  if (isUserLoggedIn == false) {
    return <LoginScreen userId={currentUserId} />;
  }

  return ("fetching data from your calendar...")
}

initializeBlock(() => <LoadPages />)


