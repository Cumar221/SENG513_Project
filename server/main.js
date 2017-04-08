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

        Messages.insert({
            text,
            createdAt: new Date(), // current time
        });
    },
});

Meteor.startup(() => {

});
