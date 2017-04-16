import React, { Component, PropTypes } from 'react';
import {Editor, EditorState, RichUtils, convertToRaw} from 'draft-js';
import RichTextEditor from 'react-rte';
import pdf  from 'html-pdf';

const URL =  "https://api.cloudinary.com/v1_1/df9evoecg/image/upload";
const UPLOADPRESET = 'xeckeflq';
const APIKEY = '299182963357756';

const styles = {
    root: {
        fontFamily: '\'Helvetica\', sans-serif',
        padding: 20,
        width: 600,
    },
    editor: {
        border: '1px solid #ccc',
        cursor: 'text',
        minHeight: 80,
        padding: 10,
    },
    button: {
        marginTop: 10,
        textAlign: 'center',
    },
};

export default class TextEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {editorState: EditorState.createEmpty(), value: RichTextEditor.createEmptyValue()};
        this.onChange = (value) => this.setState({value});
        this.cancel  = this.cancel.bind(this);
        this.send = this.send.bind(this);
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        this.handleUpload = this.handleUpload.bind(this);

        propTypes = {
            onChange: PropTypes.func
        };
    }

    cancel(event) {
        event.preventDefault();
        this.props.cancel();
    }

    handleKeyCommand(command) {
        const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
        if (newState) {
            this.onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    }

    send(event) {
        event.preventDefault();
        const content = this.state.value.toString('html');
        this.handleUpload(content);
        this.props.cancel();
    }

    onChange(value){
        this.setState({value});
        if (this.props.onChange) {
            // Send the changes up to the parent component as an HTML string.
            // This is here to demonstrate using `.toString()` but in a real app it
            // would be better to avoid generating a string on each change.
            this.props.onChange(
                value.toString('html')
            );
        }
    }

    handleUpload(file) {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', UPLOADPRESET);
        data.append('api_key', APIKEY);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', URL, false);
        xhr.send(data);
        const fileResponse = JSON.parse(xhr.responseText);

        Meteor.call('addPrivateMessage',{file: fileResponse.secure_url, uname: this.props.uname, targetUname: this.props.targetUname});
    }

    render() {
        return (
            <div id="chatMessagesContainer">
                <div>
                    <button onClick={this.cancel}>Cancel</button>
                    <button id="customButton" onClick={this.send}>Send</button>
                </div>
                <div style={styles.editor} onClick={this.focus}>
                    <RichTextEditor
                        value={this.state.value}
                        onChange={this.onChange}
                    />
                </div>
            </div>
        );
    }
}


