// will show the user her calendar for the day that they've selected
import { useRecordById, Text, useWatchable, Loader, Heading, Box} from '@airtable/blocks/ui';
import {ViewType} from '@airtable/blocks/models';
import {cursor} from '@airtable/blocks';
import React, {useEffect, useState} from 'react';
import { IndexCalendar } from './calendar';
import CalendarDialog from './createEvent.js';


// determine if the user is on a selected date or on an email
export function GetRecordDate({activeTable, selectedRecordId, selectedFieldId, currentUserId}) {
    const [indexPage, setIndexPage] = useState(null);
    const [plainIndexPage, setPlainIndexPage] = useState(null);

    const selectedField = selectedFieldId ? activeTable.getFieldByIdIfExists(selectedFieldId) : null;
    const selectedRecord = useRecordById(activeTable, selectedRecordId ? selectedRecordId : '', {
      fields: [selectedField],
    });
  
    useWatchable(cursor, ['activeTableId', 'activeViewId']);

    useEffect(() => {
      const getIndexPage = async (userId) => {
        const IndexPageWithDate = await IndexCalendar(userId,paramDate)
        setIndexPage(IndexPageWithDate);
      }
      getIndexPage(currentUserId);
    }, [selectedRecordId]);

    useEffect(() => {
      const getPlainIndexPage = async (userId) => {
        const plainPage = await IndexCalendar(userId)
        setPlainIndexPage(plainPage);
      }
      getPlainIndexPage(currentUserId);
    }, [selectedRecordId])

    if (selectedRecord === null && ((cursor.activeViewId === null) || activeTable.getViewById(cursor.activeViewId).type !== ViewType.GRID)) {
      return <Text>Switch to a grid view to see previews of your calendar on certain days</Text>; 
    }

    if ((selectedField.type !== 'date' && selectedField.type !== 'dateTime') && plainIndexPage) {
      return (
        <div>
          {plainIndexPage}
          <CalendarDialog />
        </div>
      ); 
    } else if ((selectedField.type !== 'date' && selectedField.type !== 'dateTime') && !plainIndexPage) {
      return <Text>You have not selected a valid field type</Text>;
    }

    const cellValue = selectedRecord.getCellValue(selectedField);
    
    if (!cellValue && plainIndexPage) {
      return (
        <div>
          {plainIndexPage}
          <CalendarDialog />
        </div>
      ); 
    }

    if (!cellValue && !plainIndexPage) {
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

    const paramDate = Date.parse(cellValue);

    if (indexPage) {
      return (
        <div>
            {indexPage}
            <CalendarDialog selectedDate={cellValue}/>
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