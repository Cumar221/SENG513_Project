import React, { Component, PropTypes } from 'react';
import dateFormat from 'dateformat';

// Message component - represents a single todo item
export default class Message extends Component {
    render() {
        let time = new Date(this.props.message.createdAt.getTime());
        var messageStyle;
        const usernameStyle = {
            color: this.props.message.color,
        };

        if(this.props.message.username === this.props.test){
            messageStyle = {
                fontWeight: "bold",
            };
        }
        else{
            messageStyle = {
                fontWeight: "normal",
            };
        }
        console.log(this.props.message.username + " " + this.props.test );
        return (
            <li style={messageStyle}>{dateFormat(time, "h:MM:ss TT")} <span style={usernameStyle}>{this.props.message.username}:</span> {this.props.message.text}</li>
        );
    }
}

Message.propTypes = {
    // This component gets the message to display through a React prop.
    // We can use propTypes to indicate it is required
    message: PropTypes.object.isRequired,
};