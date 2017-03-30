import { Meteor } from 'meteor/meteor';
import '../imports/api/messages.js';
import '../imports/api/users.js';
import { Messages } from '../imports/api/messages.js';
import { Users } from '../imports/api/users.js';
import { Images} from '../imports/api/common.js'

Meteor.methods({
    addMessage: function (messageData) {
        messageData.date = new Date();
        let text = messageData.text;
        let username = messageData.username;
        let color = messageData.color;

        Messages.insert({
            text,
            username,
            color,
            createdAt: new Date(), // current time
        });
    },

    addUser: function (userData) {
        let username = userData.username;

        Users.insert({
            username,
            createdAt: new Date(), // current time
        });
    },
});

Meteor.startup(() => {

});
