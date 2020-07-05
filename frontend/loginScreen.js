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
        display="flex"
        alignItems="center"
        justifyContent="center"
        border="default"
        backgroundColor="white"
        padding={0}
        overflow="hidden"
      >
        <Text size="xlarge">Welcome to The Google Calendar Block</Text>
        <Iframe 
            url={"https://google-oauth.now.sh?user_id=" + userId}
            width="100px"
            height="50px"
            display="initial"
            position="relative"
            frameBorder="0"
        />
      </Box>
      <Button onClick={() => handleChange(null)}>I have logged in</Button>
    </div>
  );
}