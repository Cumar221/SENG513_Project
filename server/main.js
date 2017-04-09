import { Meteor } from 'meteor/meteor';
import '../imports/api/messages.js';
import { Messages } from '../imports/api/messages.js';

Meteor.methods({
    addMessage: function (messageData) {
        messageData.date = new Date();
        let text = messageData.text;
        let file = messageData.file;

        Messages.insert({
            text,
            file,
            createdAt: new Date(), // current time
        });
    },
});

Meteor.startup(() => {

});
