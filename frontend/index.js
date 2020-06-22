import {initializeBlock, useBase, useWatchable, useLoadable} from '@airtable/blocks/ui';
import {session,cursor} from '@airtable/blocks';
import React, {useState, useEffect}from 'react';
import LoginScreen from './loginScreen.js';
import {IsUserLoggedIn} from './logic.js';
import {IndexCalendar} from './calendar.js';
import { GetRecordDate } from './dateCalendar.js';

require('dotenv').config('../.env')

const currentUserId = session.currentUser.id;

const LoadPages = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(null);
  const [calendarPage, setCalendarPage] = useState(null);
  const [recordPage, setRecordPage] = useState(null);

  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [selectedFieldId, setSelectedFieldId] = useState(null);

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

  const base = useBase();
  const activeTable = base.getTableByIdIfExists(cursor.activeTableId);

  // watching for a change in the page
  useEffect(() => {
    if(!calendarPage) {
      const calendarPageFunction = async () => {
        const indexdata = await IndexCalendar(currentUserId);
        setCalendarPage(indexdata)
      }
      calendarPageFunction();
    }
  }, []);

  useEffect(() => {
    if(!isUserLoggedIn) {
      const loginFunction = async () => {
        const logindata = await IsUserLoggedIn(currentUserId);
        setIsUserLoggedIn(logindata);
      }
      loginFunction()
    }
  }, []);

  useEffect(() => {
    if(selectedRecordId) {
      const recordPageFunction = async () => {
        //const recordPage = <GetRecordDate activeTable={activeTable} selectedRecordId={selectedRecordId} selectedFieldId={selectedFieldId} />
        const recordPage = GetRecordDate(activeTable,selectedRecordId,selectedFieldId);
        setRecordPage(recordPage)
      }
      recordPageFunction();
    }
  }, [selectedRecordId])

  // ready to display the page information
  if (isUserLoggedIn == false) {
    return <LoginScreen userId={currentUserId} />;
  }

  if(recordPage) {
    return recordPage;
  }

  if(calendarPage) {
    return calendarPage;
  } 

  

  return ("fetching data from your calendar...")
}

initializeBlock(() => <LoadPages />)


