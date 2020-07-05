import {Text, Box, Button} from '@airtable/blocks/ui';
import React from 'react';
import Iframe from 'react-iframe';

export default function LoginScreen({userId, login}) {
  function handleChange(newValue) {
    login(newValue);
  }
  return (
    <div className="centerPage">
      <Box
        as="header"
        display="flex"
        alignItems="center"
        justifyContent="center"
        border="default"
        backgroundColor="white"
        padding={2}
        overflow="hidden"
        marginBottom={1}
      >
      <Text size="xlarge">Welcome to The Google Calendar Block</Text>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        backgroundColor="white"
        padding={0}
        overflow="hidden"
        margin={1}
      >
        <Text>To start using this block, you must first login with Google</Text>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        backgroundColor="white"
        padding={0}
        overflow="hidden"
        margin={1}
      >
        <Iframe 
          url={"https://google-oauth.now.sh?user_id=" + userId}
          width="100px"
          height="50px"
          display="initial"
          position="relative"
          frameBorder="0"
        />
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        backgroundColor="white"
        padding={0}
        overflow="hidden"
        margin={1}
      >
        <Text>Once you have logged in, click the button below to start using this block</Text>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        backgroundColor="white"
        padding={0}
        overflow="hidden"
        margin={1}
      >
        <Button onClick={() => handleChange(null)}>See My Events</Button>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        backgroundColor="white"
        padding={0}
        overflow="hidden"
        margin={1}
      >
        <Text>* if you are seeing this screen even though you've logged in before, just click the "See My Events" button</Text>
      </Box>
    </div>
  );
}