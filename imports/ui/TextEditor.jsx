import React, { Component, PropTypes } from 'react';
import RichTextEditor from 'react-rte';

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
        this.state = {value: RichTextEditor.createEmptyValue()};
        this.onChange = (value) => this.setState({value});
        this.cancel  = this.cancel.bind(this);
        this.send = this.send.bind(this);
        this.handleUpload = this.handleUpload.bind(this);

        propTypes = {
            onChange: PropTypes.func
        };
    }

    cancel(event) {
        event.preventDefault();
        this.props.cancel();
    }

    send(event) {
        event.preventDefault();
        const html = this.state.value.toString('html');

        var pdf = new jsPDF('p', 'pt', 'letter');
        pdf.fromHTML(html);
        let test = pdf.output('datauristring');
        this.handleUpload(test);
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

        if(this.props.targetGroupID != null && this.props.targetUname == null){ // group chat
            Meteor.call('addGroupMessage',{file: fileResponse.secure_url, uname: this.props.uname, targetUname: this.props.targetUname,  targetGroupID: this.props.targetGroupID});
        }
        else if(this.props.targetGroupID == null && this.props.targetUname != null){// PM
            Meteor.call('addPrivateMessage',{file: fileResponse.secure_url, uname: this.props.uname, targetUname: this.props.targetUname});
        }
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


