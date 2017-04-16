import { Meteor } from 'meteor/meteor';
import '../imports/api/messages.js';
import { Messages } from '../imports/api/messages.js';
import { AllUsers } from '../imports/api/allUsers.js';
import { OnlineUsers } from '../imports/api/onlineUsers.js';
import { AllGroups } from '../imports/api/allGroups.js';
import {PrivateMessages} from "../imports/api/privateMessages.js";
import {GroupMessages} from "../imports/api/groupMessages.js";

Meteor.methods({
    addNewUser: function (obj) {

        console.log(obj);
        let uname = obj.uname;
        let email = obj.email;
        let pass = obj.pass;
		let secret = obj.secret;
        AllUsers.insert({
            uname,
            email,
            pass,
			secret,
            friends: [],
        });
    },

    addOnlineUser: function (obj) {
        let uname = obj.uname;
        let onlineUsers = OnlineUsers.find().fetch();
        let flag = false;

        for(i = 0; i<onlineUsers.length; i++){
            if(onlineUsers[i].uname === uname){
                flag = true;
            }
        }

        if(!flag){
            OnlineUsers.insert({
                uname,
            });
        }


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

    addPrivateMessage: function (messageData) {
        messageData.date = new Date();
        let text = messageData.text;
        let file = messageData.file;
        let uname = messageData.uname;
        let targetUname = messageData.targetUname;
        PrivateMessages.insert({
            text,
            file,
            uname,
            targetUname,
            createdAt: new Date(), // current time
        });
    },

    addGroupMessage: function (messageData) {
        messageData.date = new Date();
        let text = messageData.text;
        let file = messageData.file;
        let uname = messageData.uname;
        let targetGroupID = messageData.targetGroupID;
        GroupMessages.insert({
            text,
            file,
            uname,
            targetGroupID,
            createdAt: new Date(), // current time
        });
    },

    updateUsername: function(id, uname){
        AllUsers.update({_id : id},{$set:{uname: uname}});
    },

    removeUname: function(id){
        OnlineUsers.remove({_id: id})
    },

    updateEmail: function(id, email){
        AllUsers.update({_id : id},{$set:{email: email}});
    },

    updatePassword: function(id, pass){
        AllUsers.update({_id : id},{$set:{pass: pass}});
    },
	
	updateSecret: function(id, secret){
        AllUsers.update({_id : id},{$set:{secret: secret}});
    },

    addFriend: function(id, friendList){
        AllUsers.update({_id : id},{$set:{friends: friendList}});
    },

    addGroupMember: function(id, members){
        AllGroups.update({_id : id},{$set:{members: members}});
    },

    removeGroup: function(id){
        AllGroups.remove({_id: id });
    },

    updateGroupOwner: function(id, newUname){

        AllGroups.update({_id : id},{$set:{owner: newUname}});
    },

    updateGroupMembers: function(id, newMembers){

        AllGroups.update({_id : id},{$set:{members: newMembers}});
    },

    updateGroupInvited: function(id, invited){

        AllGroups.update({_id : id},{$set:{invited: invited}});
    },

    updateGroupName: function(id, newName){

        AllGroups.update({_id : id},{$set:{groupName: newName}});
    },

    updateGroupAdmins: function(id, newAdmins){

        AllGroups.update({_id : id},{$set:{admins: newAdmins}}); //
    },

    newGroup: function(groupName, members, admins, owner){
        AllGroups.insert({
            owner: owner,
            groupName: groupName,
            invited: members,
            members: [owner],
            admins: admins
        });
    },
});

Meteor.startup(() => {

});
