import {initializeBlock, useBase, useWatchable, useLoadable, Loader, Box, Heading} from '@airtable/blocks/ui';
import {session,cursor} from '@airtable/blocks';
import React, {useState, useEffect}from 'react';
import LoginScreen from './loginScreen.js';
import {IsUserLoggedIn} from './logic.js';
import {IndexCalendar} from './calendar.js';
import { GetRecordDate } from './dateCalendar.js';
import CalendarDialog from './createEvent.js';

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

  useEffect(() => {
    if(!isUserLoggedIn) {
      const loginFunction = async () => {
        const logindata = await IsUserLoggedIn(currentUserId);
        setIsUserLoggedIn(logindata);
      }
      loginFunction()
    }
  }, []);

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
    if(selectedRecordId) {
      const recordPageFunction = async () => {
        const recordPage = <GetRecordDate activeTable={activeTable} selectedRecordId={selectedRecordId} selectedFieldId={selectedFieldId} currentUserId={currentUserId}/>
        //const recordPage = GetRecordDate(activeTable,selectedRecordId,selectedFieldId,currentUserId);
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
    return (
      <div>
        {recordPage}
      </div>
    );
  }

  if(calendarPage) {
    return (
      <div>
        {calendarPage}
        <CalendarDialog />
      </div>
    );
  } 

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      backgroundColor="white"
      padding={0}
      height={200}
      overflow="hidden"
    >
      <Loader scale={0.3} />
      <Heading marginLeft={1}>Fetching data from you calendar...</Heading>
    </Box>
  );
}

initializeBlock(() => <LoadPages />)


