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
import Draw from './Draw.jsx';
import Friends from "./Friends.jsx";

let test = [{
    client1: "test1",
    client2: "test2",
    client3: "test3"
}];

let flag = false;

export class ChatPage extends Component{
    constructor(props) {
        super(props);
        this.cancelDraw = this.cancelDraw.bind(this);
        this.goToDraw = this.goToDraw.bind(this);
        this.onUnload   = this.onUnload.bind(this);
        this.state      = {show: false, showCreateGroup: false, showDraw: false};
        console.log(this.state);
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
        {this.removeOnlineUser();}
        this.state.showCreateGroup = false;
    }

    componentDidMount() {
        {this.handleOnlineUser();}
        window.addEventListener("beforeunload", this.onUnload)
    }

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.onUnload)
    }

    removeOnlineUser(event) {
        let {currentUID} = this.props.location.state;
        let id = OnlineUsers.findOne({uname: currentUID});

        console.log("delete");
        if(id != undefined){
            OnlineUsers.remove(id._id);
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
                str = "";

                for(i = 0; i<emails.length; i++){
                    str += emails[i]+",";
                }

                emails = str;

                temp = admins.split(",");
                admins = temp;
                str = "";
                for(i = 0; i<admins.length; i++){
                    str += admins[i]+",";
                }

                admins = str;
                let valid = true;

                for(i=0; i< this.allGroups().length; i++){
                    if(this.props.location.state.currentUID === this.allGroups()[i].owner){
                        if(groupName === this.allGroups()[i].groupName){
                            valid = false;
                        }
                    }
                }

                if(valid){
                    Meteor.call("newGroup", groupName, emails, admins, this.props.location.state.currentUID);

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
        console.log(this.props.location.state.currentUID);
        event.preventDefault();
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
        Meteor.call('addMessage',{text: text, uname: this.props.location.state.currentUID});
        // Clear form
        ReactDOM.findDOMNode(this.refs.textInput).value = '';
    }

    handleOnlineUser(){
        Meteor.call('addOnlineUser', {uname: this.props.location.state.currentUID});
    }

    renderOnlineUsers() {
        return this.props.onlineUsers.map((onlineUser) => (
            <OnlineUser key={onlineUser._id} onlineUser={onlineUser} />
        ));
    }

    renderMessages() {
        return this.props.messages.map((message) => (
            <Message key={message._id} message={message} uname = {this.props.location.state.currentUID}/>
        ));
    }

    enableCreateGroup(event){
        event.preventDefault();

        this.setState({showCreateGroup: true});
    }

    renderGroups(){
        return this.props.allGroups.map((groupName) => (
            <Groups key={groupName._id} groupName={groupName} uname = {this.props.location.state.currentUID} />
        ));
    }

    handleAddFriend(event){
        event.preventDefault();
        let friends = [];
        let friendName = event.target.friend.value;
        if(friendName === this.props.location.state.currentUID ){
            event.target.friend.style.background = "#800000";
        }else{
            event.target.friend.style.background = "#6e7e8b";
            if(friendName.length < 1){
                event.target.friend.style.background = "#800000";
            }
            else{
                event.target.friend.style.background = "#6e7e8b";
                //if(this.userOnline(friendName)){ // user is online
                    event.target.friend.style.background = "#6e7e8b";
                    if(this.validFriend(friendName)){ // friend adding is valid
                        event.target.friend.style.background = "#6e7e8b";
                        // Friend can now be added
                        friends = this.getFriends(this.props.location.state.currentUID);
                        console.log(friends);
                        friends.push(friendName);
                        Meteor.call("addFriend",this.allUsers()[this.getUnameIndex(this.props.location.state.currentUID)]._id , friends);

                    }else{ // friend exists in your list already
                        event.target.friend.style.background = "#800000";
                        console.log("friend exists in your list already");
                    }
                //}else{ // user is not online
                    console.log("User Is not online");
                    event.target.friend.style.background = "#800000";
               // }
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
    userOnline(uname){
        let valid = false;
        for(i = 0; i<this.onlineUsers().length; i++){
            if(this.onlineUsers()[i].uname === uname){
                valid = true;
            }
        }
        return valid;
    }
    // checks to see if users friend is not already there
    validFriend(friendUname){
        let valid = true;

        for(i = 0; i<this.allUsers().length; i++){
            if(this.allUsers()[i].uname ===this.props.location.state.currentUID){
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

    renderFriends(){
        let friends = [];

        friends = this.getFriends(this.props.location.state.currentUID);
        return friends.map((allUsers) => (
          <Friends key={allUsers._id} allUsers={allUsers} uname={this.props.location.state.currentUID} />
        ));
    }

    goToDraw(){
        this.setState({
            showDraw: true,
            show: false
        });
    }

    cancelDraw(){
        this.setState({
            showDraw: false,
            show: true
        });
    }

    render(){
        return(
            <div>
                <div id="header">
                    <ul id="nav">
                        <li><Link to={'/Account/'+this.props.location.state.currentUID }>Account</Link></li>
                        <li><Link to="/" onClick={this.removeOnlineUser}>Sign Out</Link></li>
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
                                        Invite Members: <input id="uname" name="email" type="text" placeholder="example@example.com"/>
                                    </div>
                                    <div className="UItem2">
                                        Admin(s): <input id="uname" name="admin" type="text" placeholder="example@example.com"/>
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
                                <Upload uname={this.props.location.state.currentUID}/>
                                {this.renderMessages()}
                            </ul>
                        </div>
                        <div id="chatMessagesBottom">
                            <form onSubmit={this.handleMessageSubmit.bind(this)} >
                                <input type="text" ref="textInput" id="chatMessagesInput" placeholder="Type message here"/>
                                <button id="customButton">Send</button>
                            </form>
                            <span><button onClick={this.goToDraw}>Draw</button></span>
                        </div>
                    </div>
                </ToggleDisplay>
                <ToggleDisplay show={this.state.showDraw}>
                    <Draw cancel={this.cancelDraw}/>
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
};

export default createContainer(() => {
    return {
        messages: Messages.find({}).fetch(),
        onlineUsers: OnlineUsers.find({}).fetch(),
        allGroups:  AllGroups.find().fetch(),
        allUsers:  AllUsers.find().fetch()
    }
}, ChatPage);