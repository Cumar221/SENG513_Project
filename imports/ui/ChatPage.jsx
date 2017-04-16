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
import GroupMessage from "./GroupMessage.jsx";
import {GroupMessages} from "../api/groupMessages.js";
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
        this.state={show: bool, showCreateGroup: false, targetUser: null, targetGroupID: null};
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
        //this.removeOnlineUser(currentUname);
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
                    console.log(emails);
                    Meteor.call("newGroup", groupName, emails, admins, currentUname);

                    event.target.groupName.value = "";
                    event.target.email.value = "";
                    event.target.admin.value = "";
                    this.setState({showCreateGroup: false});
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

    renderMessages() { // NO PM


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

        this.setState({showCreateGroup: true});
    }

    renderGroups(){
        let groupUname = [];
        return this.props.allGroups.map((groupName) => (

            <Groups key={groupName._id} groupName={groupName} uname = {currentUname} showGroupChat={this.showGroupChat.bind(this)} hideGroupChat = {this.hideGroupChat.bind(this)}  />
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
        this.setState({show: true, targetUser: value, targetGroupID: null} );
    }

    showGroupChat(groupID){
        this.setState({show:true, targetUser: null, targetGroupID: groupID});
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



        if(this.state.targetGroupID == null && this.state.targetUser != null){ // PM only
            this.state.show = true;
            if(!(friends.indexOf(this.state.targetUser) > -1)){
                this.state.targetUser = null;
                this.state.show = false;

            }
        }else if(this.state.targetGroupID != null && this.state.targetUser == null){ // group chat only
            this.state.show = true;
            if(!this.groupExists(this.state.targetGroupID)){
                this.state.show = false;
                this.state.targetGroupID = null;
            }
        }else if(this.state.targetGroupID == null && this.state.targetUser == null){ // no PM or Group Chat

        this.state.show = false;
        }

        /*
        if(this.state.targetGroupID == null){
            if(this.state.targetUser == false){
                console.log("1");
                this.state.show = true;
            }
            if(this.state.targetUser == null){
                console.log("2");
                this.state.show = false;
            }

            if(!(friends.indexOf(this.state.targetUser) > -1)){
                this.state.targetUser = "null";
                this.state.show = false;

            }
        }else{
            if(!this.groupExists(this.state.targetGroupID)){
                this.state.show = false;
                console.log("Group Doesnt Exist Anymore");
            }else{
                this.state.show = true;
                console.log("");
            }

        }

        /*
        if(this.state.targetUser == false){
            console.log("1");
            this.state.show = true;
        }
        else if(this.state.targetUser == null){
            console.log("2");
            this.state.show = false;
        }else if(this.state.targetGroupID != null){
            console.log("3");
            console.log("Group ID not NULL")
            if(!(this.allGroups().indexOf(this.state.targetGroupID) > -1)){
                this.state.show = false;
                console.log("Group Doesnt Exist Anymore");
            }
        }
        else{
            console.log("4");
            if(!(friends.indexOf(this.state.targetUser) > -1)){
                this.state.targetUser = "null";
                this.state.show = false;

            }
        }
        */


    }
	
	scrollToBottom(){
		setTimeout(function(){
			var elem = document.getElementById('chatMessagesContent');
			elem.scrollTop = elem.scrollHeight ;
		}.bind(this), 100);
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
                            <li><a href="#">Calvin</a></li>
                            <li><a href="#">Cameron</a></li>
                            <li><a href="#">Chloe</a></li>
                            <li><a href="#">Christina</a></li>
                        </ul>
                    </Collapsible>
                </div>
                <ToggleDisplay show={this.state.showCreateGroup}>
                    <div className="Main">
                        <div className="fieldContainer">
                            <form onSubmit={this.handleSubmit.bind(this)}>
                                <div className="registrationField">
                                    <div className="UItem1">
                                        Group Name: <input id="uname" name="groupName" type="text" placeholder="example"/>
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
                <ToggleDisplay show={this.state.show}>
                    <div id="chatMessagesContainer">
                        <div id="chatMessagesContent">
                            <ul id="msgCSS">
                                <Upload uname={currentUname} targetUname={this.state.targetUser}/>
                                {this.renderMessages()}
								{this.scrollToBottom()}
                            </ul>
                        </div>
                        <div id="chatMessagesBottom">
                            <form onSubmit={this.handleMessageSubmit.bind(this)} >
                                <input type="text" ref="textInput" id="chatMessagesInput" placeholder="Type message here" />
                                <button id="customButton" >Send</button>
                            </form>
                        </div>
                    </div>
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
                </div>
                <footer>
                    <div id="footer">
                        Copyright © CPSC513 Group 8
                    </div>
                </footer>
            </div>
        )
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