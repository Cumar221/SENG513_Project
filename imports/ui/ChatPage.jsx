import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Messages } from '../api/messages.js';
import Message from './Message.jsx';
import Collapsible from 'react-collapsible';
import Upload from './Upload.jsx';
import {Link} from "react-router-dom";

export class ChatPage extends Component{

    handleSubmit(event) {
        console.log(this.props.location.state.currentUID);
        event.preventDefault();
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
        Meteor.call('addMessage',{text: text});
        // Clear form
        ReactDOM.findDOMNode(this.refs.textInput).value = '';
    }

    renderMessages() {
        return this.props.messages.map((message) => (
            <Message key={message._id} message={message} />
        ));
    }

    render(){
        return(
            <div>
                <div id="header">
                    <ul id="nav">
                        <li><Link to={'/Account/'+this.props.location.state.currentUID }>Account</Link></li>
                        <li><Link to="/">Sign Out</Link></li>
                    </ul>
                </div>
                <div id="chatChannelContainer">
                    <Collapsible trigger="Groups">
                        <ul>
                            <li><a href="#">Calvin</a></li>
                            <li><a href="#">Cameron</a></li>
                            <li><a href="#">Chloe</a></li>
                            <li><a href="#">Christina</a></li>
                        </ul>
                    </Collapsible>
                    <Collapsible trigger="Friends">
                        <ul>
                            <li><a href="#">Calvin</a></li>
                            <li><a href="#">Cameron</a></li>
                            <li><a href="#">Chloe</a></li>
                            <li><a href="#">Christina</a></li>
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
                <div id="chatMessagesContainer">
                    <div id="chatMessagesContent">
                        <ul id="msgCSS">
                            <Upload/>
                            {this.renderMessages()}
                        </ul>
                    </div>
                    <div id="chatMessagesBottom">
                        <form onSubmit={this.handleSubmit.bind(this)} >
                            <input type="text" ref="textInput" id="chatMessagesInput" placeholder="Type message here"/>
                            <button id="customButton">Send</button>
                        </form>
                    </div>
                </div>
                <div id="chatOnlineContainer">
                    <Collapsible trigger="Users Online">
                        <ul>
                            <li><a href="#">Calvin</a></li>
                            <li><a href="#">Cameron</a></li>
                            <li><a href="#">Chloe</a></li>
                            <li><a href="#">Christina</a></li>
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
};

export default createContainer(() => {
    return {
        messages: Messages.find({}).fetch(),
    }
}, ChatPage);