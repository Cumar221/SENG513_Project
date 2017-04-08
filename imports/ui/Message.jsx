import React, { Component, PropTypes } from 'react';
import dateFormat from 'dateformat';

// Message component - represents a single todo item
export default class Message extends Component {
    render() {
        let time = new Date(this.props.message.createdAt.getTime());
        let date = new Date(this.props.message.createdAt.getDate());

        return (
            <li>[{dateFormat(time, "dddd, mmmm dS, yyyy, h:MM:ss TT")}] <br/> {this.props.message.text}</li>
        );
    }
}

Message.propTypes = {
    // This component gets the message to display through a React prop.
    // We can use propTypes to indicate it is required
    message: PropTypes.object.isRequired,
};