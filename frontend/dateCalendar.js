// will show the user her calendar for the day that they've selected
import { useRecordById, Text, useWatchable} from '@airtable/blocks/ui';
import {ViewType} from '@airtable/blocks/models';
import {cursor} from '@airtable/blocks';
import React, {Fragment} from 'react';

// determine if the user is on a selected date or on an email
export function GetRecordDate({activeTable, selectedRecordId, selectedFieldId}) {
    console.log("hitting this function");
    const selectedField = selectedFieldId ? activeTable.getFieldByIdIfExists(selectedFieldId) : null;
    const selectedRecord = useRecordById(activeTable, selectedRecordId ? selectedRecordId : '', {
      fields: [selectedField],
    });
  
    useWatchable(cursor, ['activeTableId', 'activeViewId']);
  
    if (selectedRecord === null && ((cursor.activeViewId === null) || activeTable.getViewById(cursor.activeViewId).type !== ViewType.GRID)) {
      return <Text>Switch to a grid view to see previews of your calendar on certain days</Text>;
    } else {
      const cellValue = selectedRecord.getCellValue(selectedField);
      if (!cellValue) {
        return (
          <Fragment>
              <Text>The “{selectedField.name}” field is empty</Text>
          </Fragment>
        );
      }
      const parsedDate = Date.parse(cellValue);
      const paramDate = new Date(parsedDate);
      return (
          <Text>{paramDate.toDateString}</Text>
      );
    }
  }