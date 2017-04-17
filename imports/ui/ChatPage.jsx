import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Messages } from '../api/messages.js';
import Message from './Message.jsx';
import OnlineUser from './OnlineUser.jsx';
import { AllGroups } from '../api/allGroups.js';
import { OnlineUsers } from '../api/onlineUsers.js';
import {AllUsers} from "../api/allUsers.js";
import Collapsible from 'react-collapsible';
import Upload from './Upload.jsx';
import { Link } from "react-router-dom";
import ToggleDisplay from 'react-toggle-display';
import Groups from "./Groups.jsx";
import Friends from "./Friends.jsx";
import {PrivateMessages} from "../api/privateMessages.js";
import PrivateMessage from "./PrivateMessage.jsx";
import PendingGroups from "./PendingGroups.jsx";
import GroupMessage from "./GroupMessage.jsx";
import GroupUsers from "./GroupUsers.jsx";
import {GroupMessages} from "../api/groupMessages.js";
import Draw from './Draw.jsx';
import TextEditor from './TextEditor.jsx';
import geolocation from 'geolocation';
let currentUname = "";
let control = true;

export class ChatPage extends Component{
    constructor(props) {
        super(props);
        this.onUnload = this.onUnload.bind(this);
        // string to boolean conversion
        let bool= false;
        if(this.props.match.params.value === "true"){
            bool = true;
        }

        currentUname = this.props.match.params.uname;
        this.state={show: bool, showCreateGroup: false, targetUser: "null" ,  showEditGroup: false, showGroupMembers: false, targetGroupID: null, showDraw: true, changeGroup: null , showTextEditor: false};
        this.cancelDraw       = this.cancelDraw.bind(this);
        this.cancelTextEditor = this.cancelTextEditor.bind(this);
        this.goToDraw         = this.goToDraw.bind(this);
        this.goToTextEditor   = this.goToTextEditor.bind(this);
        this.onUnload         = this.onUnload.bind(this);
        this.sendGeoLocation  = this.sendGeoLocation.bind(this);
    }

    privateMessages(){
        return PrivateMessages.find().fetch();
    }

    allGroups(){
        return AllGroups.find().fetch();
    }

    allUsers(){
        return AllUsers.find().fetch();
    }

    onlineUsers(){
        return OnlineUsers.find().fetch();
    }

    onUnload(event) {
        this.removeOnlineUser(currentUname);
        this.state.showCreateGroup = false;
    }

    componentDidMount() {
        currentUname = this.props.match.params.uname;
        {this.handleOnlineUser();}
        window.addEventListener("beforeunload", this.onUnload)
    }

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.onUnload)
    }

    showEditGroup(id){
        this.setState({showEditGroup: true, changeGroup : id, show: false})
    }

    hideEditGroup(id){
        this.setState({showEditGroup: false, changeGroup : null, targetGroupID: id, show: true}) ////
    }

    removeOnlineUser(uname) {
        let currentUID = currentUname;
        console.log(currentUID);
        let index = -1;
        for(i = 0; i<this.onlineUsers().length; i++){
            if(this.onlineUsers()[i].uname === currentUID){
                index = i;
                break;
            }
        }
        let id = this.onlineUsers()[index]._id;

        if(id != undefined){
            Meteor.call("removeUname",id);
        }
    }

    handleSubmit(event){
        event.preventDefault();
        let groupName = event.target.groupName.value;
        groupName = groupName.toLowerCase();
        let emails = event.target.email.value.trim();
        let admins = event.target.admin.value.trim();

        if(groupName.length < 1){
            event.target.groupName.style.background = "#800000";
        }

        else{
            event.target.groupName.style.background = "#6e7e8b";
        }

        if(emails.length > 0){
            event.target.email.style.background = "#6e7e8b";
            if(groupName.length > 0){
                event.target.groupName.style.background = "#6e7e8b";

                let temp = [];
                admins = admins.replace(/ /g,'');
                emails = emails.replace(/ /g,'');
                temp = emails.split(",");
                emails = temp;

                temp = admins.split(",");
                admins = temp;

                let valid = true;

                for(i=0; i< this.allGroups().length; i++){
                    if(currentUname === this.allGroups()[i].owner){
                        if(groupName === this.allGroups()[i].groupName){
                            valid = false;
                        }
                    }
                }

                if(valid){

                    let temp = [];
                    let flag = true;
                    for(i = 0; i<emails.length; i++){
                        if(emails[i] !== currentUname){
                            temp.push(emails[i]);
                        }else{
                            flag = false;
                            break;
                        }
                    }

                    emails = temp; //
                    if(flag){
                        Meteor.call("newGroup", groupName, emails, admins, currentUname);
                        event.target.groupName.value = "";
                        event.target.email.value = "";
                        event.target.admin.value = "";
                        this.setState({showCreateGroup: false});
                    }else{
                        event.target.email.style.background = "#800000";
                    }



                }else{
                    event.target.groupName.style.background = "#800000";
                }
            }else{
                console.log("no group name given");
                event.target.groupName.style.background = "#800000";
            }


        }else{
            event.target.email.style.background = "#800000";
            console.log("no emails given");

        }
    }

    handleMessageSubmit(event) {
        event.preventDefault();
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

        if(this.state.targetGroupID != null && this.state.targetUser == null){ // group chat
            if(text.length > 0){

                Meteor.call('addGroupMessage',{text: text, uname: currentUname, targetUname: this.state.targetUser, targetGroupID: this.state.targetGroupID});
            }
        }
        else if(this.state.targetGroupID == null && this.state.targetUser != null){// PM
            if(text.length > 0){
                Meteor.call('addPrivateMessage',{text: text, uname: currentUname, targetUname: this.state.targetUser});
            }
            this.scrollToBottom();
        }
        // Clear form
        ReactDOM.findDOMNode(this.refs.textInput).value = '';
    }

    handleOnlineUser(){
        console.log(this.onlineUsers());
        if(!this.unameExists(currentUname)){
            console.log("Uname Doesnt exist");
            Meteor.call('addOnlineUser', {uname: currentUname});
        }else{
            console.log("Uname Exists");
        }

    }

    unameExists(uname){
        let flag = false;
        for(i = 0; i< this.onlineUsers().length; i++){
            if(this.onlineUsers()[i].uname === uname){
                flag = true;
            }
        }
        return flag;
    }

    renderOnlineUsers() {
        return this.props.onlineUsers.map((onlineUser) => (
            <OnlineUser key={onlineUser._id} onlineUser={onlineUser} />
        ));
    }

    memberExists(uname){
        let users = [];
        users = this.getGroupMembers(this.state.targetGroupID);
        flag = false;

        for(i = 0; i<users.length; i++){
            if(uname === users[i]){
                flag = true;
                break;
            }
        }
        return flag;
    }

    renderGroupUsers(){
        users = [];
        users = this.getGroupMembers(this.state.targetGroupID);
        return users.map((onlineUser) => (
            <GroupUsers key={onlineUser._id} onlineUser={onlineUser} />
        ));
    }

    getGroupMembers(id){
        let members = [];
        for(i = 0;i<this.allGroups().length; i++){
            if(this.allGroups()[i]._id === id){
                members = this.allGroups()[i].members;
                break;
            }
        }
        return members;
    }
    getGroupInvited(id){
        let members = [];
        for(i = 0;i<this.allGroups().length; i++){
            if(this.allGroups()[i]._id === id){
                members = this.allGroups()[i].invited;
                break;
            }
        }
        return members;
    }

    getGroupAdmins(id){
        let members = [];
        for(i = 0;i<this.allGroups().length; i++){
            if(this.allGroups()[i]._id === id){
                members = this.allGroups()[i].admins;
                break;
            }
        }
        return members;
    }

    renderMessages() { // NO PM
        this.scrollToBottom();

        if(this.state.targetGroupID != null && this.state.targetUser == null){  // GROUP CHAT

            let id = this.state.targetGroupID;


            console.log("Sending ID:  "+ id);

            return this.props.groupMessages.map((message) => (
                <GroupMessage key={message._id} message={message} id = {id} uname={currentUname}/>
            ));
        }
        else if(this.state.targetGroupID == null && this.state.targetUser != null) { // PM

            return this.props.privateMessages.map((message) => (
                <PrivateMessage key={message._id} message={message} uname = {currentUname} targetUname={this.state.targetUser}/>
            ));
        }

    }

    enableCreateGroup(event){
        event.preventDefault();
        this.setState({
            showCreateGroup: true,
            show: false,
            showDraw: false,
            showTextEditor: false,
            showEditGroup : false
        });
    }

    renderGroups(){
        let groupUname = [];
        return this.props.allGroups.map((groupName) => (

            <Groups key={groupName._id} groupName={groupName} uname = {currentUname} showGroupChat={this.showGroupChat.bind(this)} hideGroupChat = {this.hideGroupChat.bind(this)} hideEditGroup={this.hideEditGroup.bind(this)}  showEditGroup={this.showEditGroup.bind(this)} />
        ));
    }

    fillUnames(groupMember){
        let groupUnames = [];
        for(i = 0; i<this.allGroups().length; i++){

        }
    }

    isMember(groupName){
        flag = false;
        for(i = 0; i<this.allGroups().length; i++){
            if(this.allGroups()[i].groupName === groupName){
                if(this.allGroups()[i].members.indexOf(currentUname) > -1){
                    flag = true;
                    break;
                }
            }
        }
        return flag;
    }

    handleAddFriend(event){
        event.preventDefault();
        let friends = [];
        let friendName = event.target.friend.value;
        if(friendName === currentUname ){
            event.target.friend.style.background = "#800000";
        }else{
            event.target.friend.style.background = "#6e7e8b";
            if(friendName.length < 1){
                event.target.friend.style.background = "#800000";
            }
            else{
                event.target.friend.style.background = "#6e7e8b";
                if(this.userExists(friendName)){ // user exists
                    event.target.friend.style.background = "#6e7e8b";
                    if(this.validFriend(friendName)){ // friend adding is valid
                        event.target.friend.style.background = "#6e7e8b";

                        // Friend can now be added
                        friends = this.getFriends(currentUname);

                        friends.push(friendName);
                        Meteor.call("addFriend",this.allUsers()[this.getUnameIndex(currentUname)]._id , friends);

                        friends = this.getFriends(friendName);
                        friends.push(currentUname);
                        Meteor.call("addFriend",this.allUsers()[this.getUnameIndex(friendName)]._id , friends);


                    }else{ // friend exists in your list already
                        event.target.friend.style.background = "#800000";
                        console.log("friend exists in your list already");
                    }
                }else{ // user is not online
                    event.target.friend.style.background = "#800000";
                    console.log("friend not in db");
               }

            }
        }


        event.target.friend.value = "";
    }

    // returns array of all users friends
    getFriends(uname){
        friends = [];
        for(i = 0; i<this.allUsers().length; i++){
            if(this.allUsers()[i].uname === uname){

                friends = this.allUsers()[i].friends;
                break;
            }

        }

        return friends;
    }

    // checks to see if user is online
    userExists(uname){
        let valid = false;
        for(i = 0; i<this.allUsers().length; i++){
            if(this.allUsers()[i].uname === uname){
                valid = true;
            }

        }

        return valid;

    }
    // checks to see if users friend is not already there
    validFriend(friendUname){
        let valid = true;

        for(i = 0; i<this.allUsers().length; i++){
            if(this.allUsers()[i].uname ===currentUname){
                if(this.allUsers()[i].friends.indexOf(friendUname) > -1){
                    valid = false;
                }
            }

        }

        return valid;
    }

    getUnameIndex(uname){
        let index = -1;
        for(var i = 0; i<this.allUsers().length; i++){
            if(this.allUsers()[i].uname === uname){
                index = i;
                break;
            }
        }
        return index;
    }

    showPM(value){
        this.setState({show: true, targetUser: value, targetGroupID: null, showCreateGroup: false} );
    }

    showGroupChat(groupID){
        this.setState({show:true, targetUser: null, targetGroupID: groupID, showCreateGroup: false});
    }

    hideGroupChat(username){
        if(currentUname === username){
            this.setState({show: false, targetUser: null, targetGroupID: null});
        }
    }

    hidePM(value){
        this.setState({show: false, targetUser: null, targetGroupID: null} );
    }

    renderFriends(){
        let friends = [];
        friends = this.getFriends(currentUname);
        return friends.map((allUsers) => (
            <Friends key={allUsers._id} allUsers={allUsers} uname={currentUname} targetUser={this.state.targetUser} showPM={this.showPM.bind(this)} hidePM={this.hidePM.bind(this)}/>
        ));
    }

    groupExists(id){
        for(i = 0; i< this.allGroups().length; i++){
            if(this.allGroups()[i]._id == id){
                return true;
            }
        }
        return false;
    }

    validateTarget(){
        friends = [];
        friends = this.getFriends(currentUname);

        console.log("VALID: "+ this.state.showCreateGroup);
        let val = this.state.showCreateGroup;

        if(this.state.showDraw == true || this.state.showTextEditor == true){
            this.state.show = false;

        }else if(this.state.targetGroupID == null && this.state.targetUser != null){ // PM only

            this.state.show = true;
            this.state.showGroupMembers = false;
            this.state.showCreateGroup= false;
            this.state.showEditGroup = false;
            if(!(friends.indexOf(this.state.targetUser) > -1)){
                this.state.targetUser = null;
                this.state.show = false;
            }

        }else if(this.state.targetGroupID != null && this.state.targetUser == null){ // group chat   only
            if(!this.state.show){
                this.state.showEditGroup = true;
            }else{
                this.state.showEditGroup = false;
            }
            if(this.state.showCreateGroup){ //
                this.state.showEditGroup = false;
            }
            this.state.show = true;
            this.state.showGroupMembers = true;
            this.state.showCreateGroup= false;
            if(!this.groupExists(this.state.targetGroupID)){
                this.state.show = false;
                this.state.showGroupMembers = false;
                this.state.targetGroupID = null;
                this.state.showEditGroup = false;
            }
            if(this.state.showEditGroup){
                this.state.show=false;
                this.state.showGroupMembers = true;
                this.state.changeGroup = this.state.targetGroupID;
            }

        }else if(this.state.targetGroupID == null && this.state.targetUser == null){ // no     PM or Group Chat
            this.state.showGroupMembers = false;
            this.state.show = false;
            this.state.showEditGroup = false;
        }

        if(val){
            this.state.showGroupMembers = false;
            this.state.show = false;
            this.state.showCreateGroup = true;
        }
    }

    goToDraw(){
        this.setState({
            showDraw: true,
            show: false,
        });
    }

    goToTextEditor(){
        this.setState({
            showTextEditor: true,
            show: false,
        });
    }

    sendGeoLocation(){
        var targetUser = this.state.targetUser;
        var targetGroupID = this.state.targetGroupID;
        geolocation.getCurrentPosition(function (err, position) {
            if (err) throw err
            let text = position.coords.latitude + "," + position.coords.longitude;
           // var img_url = "https://maps.googleapis.com/maps/api/staticmap?center="+latlon+"&zoom=14&size=400x300&sensor=false&key=AIzaSyAiX1it0sfKz_5yIPO2PLMifA7PvkUcbNI";

            if(targetGroupID != null && targetUser == null){ // group chat
                Meteor.call('addGroupMessage',{text: text, uname: currentUname, targetUname: targetUser, targetGroupID: targetGroupID});

            }
            else if(targetGroupID == null && targetUser != null){// PM
                Meteor.call('addPrivateMessage',{text: text, uname: currentUname, targetUname: targetUser});            }
        });
    }

    cancelDraw(value){
        this.setState({
            show: true,
            showDraw: false
        });
    }

    cancelTextEditor(){
        this.setState({
            show: true,
            showTextEditor: false
        });
    }

    renderPendingGroups(){
        return this.props.allGroups.map((groupName) => (
            <PendingGroups key={groupName._id} groupName={groupName} uname = {currentUname}/>
        ));
    }

	scrollToBottom(){
        console.log("SCROLLING");
		setTimeout(function(){
			var elem = document.getElementById('chatMessagesContent');
			elem.scrollTop = elem.scrollHeight ;
		}.bind(this), 100);
	}

	handleGroupChange(event){ //
        event.preventDefault();
        let newname = event.target.groupName.value;
        let newMembers = event.target.email.value;
        let newAdmins = event.target.admin.value;
        let temp = [];
        if(newname.length > 0){
            // update new group name
            Meteor.call("updateGroupName", this.state.targetGroupID, newname);
        }

        if(newMembers.length > 0){

            newMembers = newMembers.replace(/ /g,'');
            newAdmins = newAdmins.replace(/ /g,'');
            temp = newMembers.split(",");
            newMembers = temp;
            let oldInvited = this.getGroupInvited(this.state.targetGroupID);
            temp = oldInvited.concat(newMembers);
            let temp2 = [];
            let flag = true;
            for(i = 0; i<temp.length; i++){

                if(!this.memberExists(temp[i])){ //
                    temp2.push(temp[i]);
                }else{
                    flag = false;
                }
            }///

                Meteor.call("updateGroupInvited", this.state.targetGroupID, temp2);



        }
        if(newAdmins.length > 0){
            temp = newAdmins.split(",");
            newAdmins = temp;
            let oldAdmins = this.getGroupAdmins(this.state.targetGroupID);
            temp = oldAdmins.concat(newAdmins);
            console.log("Admin List: "+ temp);
            Meteor.call("updateGroupAdmins", this.state.targetGroupID, temp);
        }
        event.target.groupName.value = "";
        event.target.email.value = "";
        event.target.admin.value = "";
        this.hideEditGroup(this.state.targetGroupID);
    }


    render(){
        this.validateTarget();

        currentUname = this.props.match.params.uname;
        console.log("FLAG: "+ this.state.show);
        return(
            <div>
                <div id="header">
                    <ul id="nav">
                        <li><Link onClick={this.removeOnlineUser.bind(this)} to={'/Account/'+currentUname }>Account</Link></li>
                        <li><Link to="/" onClick={this.removeOnlineUser.bind(this)}>Sign Out</Link></li>
                    </ul>
                </div>
                <div id="chatChannelContainer">
                    <Collapsible trigger="Groups">
                        <ul>
                            <li><a href="" onClick={this.enableCreateGroup.bind(this)}>Create New Group</a></li>
                            {this.renderGroups()}
                        </ul>
                    </Collapsible>
                    <Collapsible trigger="Friends">
                        <ul>
                            {this.renderFriends()}
                        </ul>
                    </Collapsible>
                    <Collapsible trigger="Pending Groups">
                        <ul>
                            {this.renderPendingGroups()}
                        </ul>
                    </Collapsible>
                </div>
                <ToggleDisplay show={this.state.showCreateGroup}>
                    <div className="GroupChat">
                        <div className="fieldContainer">
                            <form onSubmit={this.handleSubmit.bind(this)}>
                                <div className="registrationField">
                                    <div className="UItem1">
                                        Group Name: <input id="uname" name="groupName" type="text" placeholder="example "/>
                                    </div>
                                    <div className="UItem2">
                                        Invite Members: <input id="uname" name="email" type="text" placeholder="example, example2"/>
                                    </div>
                                    <div className="UItem2">
                                        Admin(s): <input id="uname" name="admin" type="text" placeholder="example, example2"/>
                                    </div>
                                    <div className="register">
                                        <br></br> <input type="submit" value="Create Group" id="register"/>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </ToggleDisplay>
                <ToggleDisplay show={this.state.showEditGroup}>
                    <div className="GroupSettings">
                        <div className="fieldContainer">
                            <form onSubmit={this.handleGroupChange.bind(this)}>
                                <div className="registrationField">
                                    <div className="UItem1">
                                        New Group Name: <input id="uname" name="groupName" type="text" placeholder="example "/>
                                    </div>
                                    <div className="UItem2">
                                        Invite Members: <input id="uname" name="email" type="text" placeholder="example, example2"/>
                                    </div>
                                    <div className="UItem2">
                                        Add Admin(s): <input id="uname" name="admin" type="text" placeholder="example, example2"/>
                                    </div>
                                    <div className="Save Changes">
                                        <br></br> <input type="submit" value="Save Changes" id="register"/>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </ToggleDisplay>
                <ToggleDisplay show={this.state.show}>
                    <div id="chatMessagesContainer">
                        <div id="chatMessagesContent">
                            <ul id="msgCSS">
                                <Upload uname={currentUname} targetUname={this.state.targetUser} targetGroupID={this.state.targetGroupID}/>
                                {this.renderMessages()}
                                {this.scrollToBottom()}
                            </ul>
                        </div>
                        <div id="chatMessagesBottom">
                            <form id="chatForm" onSubmit={this.handleMessageSubmit.bind(this)} >
                                <input type="text" ref="textInput" id="chatMessagesInput" placeholder="Type message here" />
                            </form>
                            <span>
                                <button  id="customButton" onClick={this.goToDraw}>Draw</button>
                                <button  id="customButton" onClick={this.goToTextEditor}>TextEditor</button>
                                <button  id="customButton" onClick={this.sendGeoLocation}>FindME</button>
                            </span>
                        </div>
                    </div>
                </ToggleDisplay>
                <ToggleDisplay show={this.state.showDraw}>
                    <Draw cancel={this.cancelDraw} uname={currentUname} targetUname={this.state.targetUser} targetGroupID={this.state.targetGroupID}/>
                </ToggleDisplay>
                <ToggleDisplay show={this.state.showTextEditor}>
                    <TextEditor cancel={this.cancelTextEditor} uname={currentUname} targetUname={this.state.targetUser} targetGroupID={this.state.targetGroupID}/>
                </ToggleDisplay>
                <div id="chatOnlineContainer">
                    <form onSubmit={this.handleAddFriend.bind(this)}>
                        <label id="addFriends">Add Friends:</label>
                        <input id = "uname" type="text" name = "friend" placeholder="Enter username"/>
                        <input id = "uname" type ="submit" value = "ADD"/>
                    </form>
                    <Collapsible trigger="Users Online">
                        <ul id="onlineUser">
                            {this.renderOnlineUsers()}
                        </ul>
                    </Collapsible>
                    <ToggleDisplay show={this.state.showGroupMembers}>
                        <Collapsible trigger="Group Users">
                            <ul id="onlineUser">
                                {this.renderGroupUsers()}
                            </ul>
                        </Collapsible>
                    </ToggleDisplay>
                    {this.state.showDraw = false}

                </div>
                <footer>
                    <div id="footer">
                        Copyright © CPSC513 Group 8
                    </div>
                </footer>
            </div>
        )
        this.scrollToBottom();
    }
}

ChatPage.propTypes = {
    messages: PropTypes.array.isRequired,
    onlineUsers: PropTypes.array.isRequired,
    allGroups: PropTypes.array.isRequired,
    allUsers: PropTypes.array.isRequired,
    privateMessages: PropTypes.array.isRequired,
    groupMessages : PropTypes.array.isRequired,
};

export default createContainer(() => {
    return {
        messages: Messages.find({}).fetch(),
        onlineUsers: OnlineUsers.find({}).fetch(),
        allGroups:  AllGroups.find().fetch(),
        allUsers:  AllUsers.find().fetch(),
        privateMessages:  PrivateMessages.find().fetch(),
        groupMessages:  GroupMessages.find().fetch()
    }
}, ChatPage);
