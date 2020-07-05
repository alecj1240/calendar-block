import React, {useState} from "react";
import {Button, Dialog, Heading, Input, Box, Text} from "@airtable/blocks/ui";

export default function CalendarDialog(paramDate) {
  if (typeof paramDate["selectedDate"] == 'undefined') {
    var selectedDate = (new Date(Date.now()))
    selectedDate = selectedDate.setMinutes(selectedDate.getMinutes() - (new Date()).getTimezoneOffset());
    selectedDate = (new Date(selectedDate)).toISOString().split('.')[0];
  } else if (paramDate["selectedDate"].includes("T")) {
    var selectedDate = (new Date(Date.parse(paramDate["selectedDate"])));
    selectedDate = selectedDate.setMinutes(selectedDate.getMinutes() - (new Date()).getTimezoneOffset());
    selectedDate = (new Date(selectedDate)).toISOString().split('.')[0];
  } else {
    var selectedDate = (new Date(Date.parse(paramDate["selectedDate"]))).toISOString().split('.')[0]
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [startTime, setStartTime] = useState(selectedDate);
  const [endTime, setEndTime] = useState(selectedDate);
  const [description, setDescription] = useState("");

  const parseDate = (theDate) => {
    if (theDate == '') {
      return "";
    }
    var newDate = (new Date(Date.parse(theDate))).toISOString();
    newDate = newDate.split('.')[0]+"Z";
    newDate = newDate.replace("-", '');
    newDate = newDate.replace(":", '');
    newDate = newDate.replace("-", '');
    newDate = newDate.replace(":", '');
    return newDate;
  }


  const handleNewEvent = (title,start,end,desc) => {
    var url = new URL('https://www.google.com/calendar/render');

    var urlParams = {
        action:  'TEMPLATE',
        text:    title,
        details: desc,
        dates: parseDate(start) + '/' + parseDate(end)
    };
    url.search = new URLSearchParams(urlParams).toString();

    window.open(url);
  }

  const handleClose = () => {
    setIsDialogOpen(false);
    setTitleValue("");
    setStartTime("");
    setEndTime("");
    setDescription("");
  }

  return (
    <React.Fragment>
      <Box
        display="flex"
        marginLeft={1}
        borderRadius="large"
        padding={2}
        overflow="hidden"
      >
      <Button onClick={() => setIsDialogOpen(true)}>Add Event</Button>
      {isDialogOpen && (
        <Dialog onClose={() => setIsDialogOpen(false)}>
          <Dialog.CloseButton />
          <Heading>Create A New Calendar Event</Heading>
          <Text>Event Title</Text>
          <Input
            value={titleValue}
            onChange={e => setTitleValue(e.target.value)}
            placeholder="title of event"
          />
          <Text>Start Time</Text>
          <Input 
            type="datetime-local"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            placeholder="start time"
          />
          <Text>End Time</Text>
          <Input 
            type="datetime-local"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            placeholder="end time"
          />
          <Text>Event Description</Text>
          <Input 
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="description"
          />
          <Button onClick={() => handleNewEvent(titleValue,startTime,endTime,description)} marginTop={1} type="submit">Create New Event</Button>
          <Button onClick={() => handleClose()} marginTop={1} marginLeft={1}>Close</Button>
        </Dialog>
      )}
      </Box>
    </React.Fragment>
  );
}
