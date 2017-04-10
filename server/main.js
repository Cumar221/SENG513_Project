import { Meteor } from 'meteor/meteor';
import '../imports/api/messages.js';
import { Messages } from '../imports/api/messages.js';
import { AllUsers } from '../imports/api/allUsers.js';

Meteor.methods({
    addNewUser: function (obj) {
        console.log(obj);
        let uname = obj.uname;
        let email = obj.email;
        let pass = obj.pass;
        AllUsers.insert({
            uname,
            email,
            pass,
        });
    },

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
