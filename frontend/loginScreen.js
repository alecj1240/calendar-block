import {Text, Box} from '@airtable/blocks/ui';
import React from 'react';
import Iframe from 'react-iframe';

export default function LoginScreen(userId) {
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
            url={"https://google-oauth.now.sh?user_id=" + userId["userId"]}
            width="100px"
            height="50px"
            display="initial"
            position="relative"
            frameBorder="0"
        />
      </Box>
    </div>
  );
}