import { Meteor } from 'meteor/meteor';
import '../imports/api/messages.js';
import { Messages } from '../imports/api/messages.js';

Meteor.methods({
    addMessage: function (messageData) {
        messageData.date = new Date();
        let text = messageData.text;
        let image = messageData.image;

        Messages.insert({
            text,
            image,
            createdAt: new Date(), // current time
        });
    },
});

Meteor.startup(() => {

});
