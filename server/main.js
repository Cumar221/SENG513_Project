import { Meteor } from 'meteor/meteor';
import '../imports/api/messages.js';
import { Messages } from '../imports/api/messages.js';
import { AllUsers } from '../imports/api/allUsers.js';
import { OnlineUsers } from '../imports/api/onlineUsers.js';


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

    addOnlineUser: function (obj) {
        let uname = obj.uname;

        OnlineUsers.insert({
            uname,
        });
    },

    addMessage: function (messageData) {
        messageData.date = new Date();
        let text = messageData.text;
        let file = messageData.file;
        let uname = messageData.uname;

        Messages.insert({
            text,
            file,
            uname,
            createdAt: new Date(), // current time
        });
    },

    updateUsername: function(id, uname){
        AllUsers.update({_id : id},{$set:{uname: uname}});
    },

    updateEmail: function(id, email){
        AllUsers.update({_id : id},{$set:{email: email}});
    },

    updatePassword: function(id, pass){
        AllUsers.update({_id : id},{$set:{pass: pass}});
    },
});

Meteor.startup(() => {

});
