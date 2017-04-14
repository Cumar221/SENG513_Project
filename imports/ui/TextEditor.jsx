import React, { Component, PropTypes } from 'react';
import {Editor, EditorState} from 'draft-js';

export default class TextEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {editorState: EditorState.createEmpty()};
        this.onChange = (editorState) => this.setState({editorState});
        this.cancel  = this.cancel.bind(this);
    }

    cancel(event) {
        event.preventDefault();
        this.props.cancel();
    }

    render() {
        return (
            <div id="chatMessagesContainer">
                <Editor
                    editorState={this.state.editorState}
                    onChange={this.onChange}
                    placeholder="Enter some text..."
                />
                <div id="chatMessagesBottom">
                    <button id="customButton" onClick={this.cancel}>Cancel</button>
                </div>
            </div>
        );
    }
}
