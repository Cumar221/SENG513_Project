import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import App from '../imports/ui/App.jsx';
import ChatPage from '../imports/ui/ChatPage'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Fake } from 'meteor/anti:fake';
import {getCookie,checkCookie} from '../imports/api/cookies.js'

Meteor.startup(() => {
    //render(<App username= {getCookie("username")}/>, document.getElementById('render-target'));
    render(<ChatPage/>, document.getElementById('render-target'));
});