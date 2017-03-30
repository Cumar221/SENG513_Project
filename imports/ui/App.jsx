import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Messages } from '../api/messages.js';
import { Users } from '../api/users.js';
import Message from './Message.jsx';
import User from './User.jsx';
import UploadImages from './UploadImages.jsx';
import {getCookie,setCookie,deleteCookies} from '../api/cookies.js'

// App component - represents the whole app
class App extends Component {
    constructor(props) {
        super(props);
        this.onUnload = this.onUnload.bind(this);
        this.state = {color: "black",username: "unknown"};
    }

    onUnload(event) { // the method that will be used for both add and remove event
        console.log("hellooww");
        {this.removeUser();}
    }

    componentDidMount() {
        console.log("mount");
       {this.handleNewUser();}
        window.addEventListener("beforeunload", this.onUnload);
    }

    componentWillUnmount() {
        console.log("unmount");
        window.removeEventListener("beforeunload", this.onUnload);
    }

    removeUser() {
        let {username} = this.props;
        let id = Users.findOne({username: username});
        Users.remove(id._id);
    }

    handleNewUser(){
     Meteor.call('addUser',{username: this.props.username});
    }

    hexToRgbA(hex){
        var c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
        }
        throw new Error('Bad Hex');
    }

    handleSubmit(event) {
        event.preventDefault();

        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
        let {username} = this.props;
        let command = text.split(/[^0-9'a-zA-Z_]/).filter(Boolean);
        let color = this.state.color;

        if(text[0] != '/') {
            Meteor.call('addMessage',{text: text, username: username, color: color});
        }
        else if (text.indexOf('nickcolor') !== -1) {
            let rgb = this.hexToRgbA('#' + command[1]);
            this.setState({color: rgb});
            console.log(rgb);
        }
        else if(text.indexOf('nick') !== -1){
            let id = Users.findOne({username: command[1]});

            if(id === undefined){
                console.log(id);
                console.log(this.props.username);
                setCookie("username",command[1],365);
                location.reload();
            }
            else{
                alert("Sorry, Username " + command[1] + " already exists. Try Again");
            }
        }
        else if(text.indexOf('deleteCookie') !== -1){
            deleteCookies();
            location.reload();
        }
        // Clear form
        ReactDOM.findDOMNode(this.refs.textInput).value = '';
    }

    renderMessages() {
        return this.props.messages.map((message) => (
            <Message key={message._id} message={message} test={getCookie("username")}/>
        ));
    }

    renderUsers(){
        return this.props.users.map((user) => (
            <User key={user._id} user={user} test={getCookie("username")}/>
        ));
    }

    render() {
        return (
            <div className="container">
                <div className="messages">
                    <ul>
                        <UploadImages/>
                        {this.renderMessages()}
                    </ul>
                </div>
                <div className="online" >
                    <ul>
                        {this.renderUsers()}
                    </ul>
                </div>
                <footer>
                    <form className="new-message" onSubmit={this.handleSubmit.bind(this)} >
                        <input type="text" ref="textInput" placeholder="Type message here"/>
                        <button className="sendButton">Send</button>
                        <button className="sendButton">Image</button>
                        <button className="sendButton">GIF</button>
                    </form>
                </footer>
            </div>
        );
    }
}

App.propTypes = {
    messages: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
    username: PropTypes.string.isRequired,
};

export default createContainer(() => {
    return {
        messages: Messages.find({}).fetch(),
        users: Users.find({}).fetch(),
    }
}, App);