import {initializeBlock} from '@airtable/blocks/ui';
import {session} from '@airtable/blocks';
import React from 'react';
import LoginScreen from './loginScreen';

const currentUserId = session.currentUser.id;

function HelloWorldBlock() {
    return (
      <LoginScreen />
    );
}

initializeBlock(() => <HelloWorldBlock />);
