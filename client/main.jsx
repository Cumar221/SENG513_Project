import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import ChatPage from '../imports/ui/ChatPage'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.css';

Meteor.startup(() => {
    render(<ChatPage/>, document.getElementById('render-target'));
});