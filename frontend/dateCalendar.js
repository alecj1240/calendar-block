// will show the user her calendar for the day that they've selected
import { useRecordById, Text, useWatchable} from '@airtable/blocks/ui';
import {ViewType} from '@airtable/blocks/models';
import {cursor} from '@airtable/blocks';
import React, {Fragment, useEffect, useState} from 'react';
import { IndexCalendar } from './calendar';
import Iframe from 'react-iframe';

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

    const cellValue = selectedRecord.getCellValue(selectedField);

    if (!cellValue && plainIndexPage) {
      return (<div>{plainIndexPage}</div>); 
    }

    const paramDate = Date.parse(cellValue);

    if (indexPage) {
      return (
        <div>
            {indexPage}
        </div>
      );
    }

    return ("fetching data from your calendar...")

  }