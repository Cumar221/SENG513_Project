import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Messages } from '../api/messages.js';
import Message from './Message.jsx';
import UploadImages from './UploadImages.jsx';

export default class MessageRender extends Component {
    constructor(props) {
        super(props);
        this.state = {color: "black",username: "unknown"};
    }

    handleSubmit(event) {
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

    render() {
        return (
            <div>
                <div>

                </div>
            </div>
        );
    }
}

MessageRender.propTypes = {
    messages: PropTypes.array.isRequired,
};

createContainer(() => {
    return {
        messages: Messages.find({}).fetch(),
    }
}, MessageRender);