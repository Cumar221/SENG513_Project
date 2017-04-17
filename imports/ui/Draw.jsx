import React, { Component, PropTypes } from 'react';
import {SketchField, Tools} from 'react-sketch';
import {SketchPicker} from 'react-color';
import {Modal} from 'react-overlays';

const URL =  "https://api.cloudinary.com/v1_1/df9evoecg/image/upload";
const UPLOADPRESET = 'xeckeflq';
const APIKEY = '299182963357756';

const modalStyle = {
    position: 'fixed',
    marginLeft: '16.5%',
    marginRight: '16.5%',
    marginTop: '52px',
    marginBottom: '32px',
    zIndex: 1040,
    top: 0, bottom: 0, left: 0, right: 0
};

const test ={
    verticalAlign: 'middle'
}

const backdropStyle = {
    ...modalStyle,
    zIndex: 'auto',
    backgroundColor: '#000',
    opacity: 0.5
};

export default class Draw extends Component{
    constructor(props) {
        super(props);
        this.state = {
            lineColor: 'black',
            lineWidth: 3,
            fillColor: '#68CCCA',
            backgroundColor: 'transparent',
            shadowWidth: 0,
            shadowOffset: 0,
            tool: Tools.Pencil,
            fillWithColor: false,
            fillWithBackgroundColor: false,
            drawings: [],
            canUndo: false,
            canRedo: false,
            controlledSize: false,
            sketchWidth: 600,
            sketchHeight: 600,
            stretched: true,
            stretchedX: false,
            stretchedY: false,
            originX: 'left',
            originY: 'top',
            showModal: false
        };

        this.clear = this.clear.bind(this);
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);
        this.send = this.send.bind(this);
        this.cancel = this.cancel.bind(this);
        this.close = this.close.bind(this);
        this.color = this.color.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.handleFontChangeComplete = this.handleFontChangeComplete.bind(this);
        this.pencil = this.pencil.bind(this);
        this.circle = this.circle.bind(this);
        this.rectangle = this.rectangle.bind(this);
        this.pan = this.pan.bind(this);
    }

    clear(event){
        event.preventDefault();
        this._sketch.clear();
    }

    undo(event) {
        event.preventDefault();
        this._sketch.undo();
    }

    redo(event) {
        event.preventDefault();
        this._sketch.redo();
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

    send(event) {
        event.preventDefault();
        this.handleUpload(this._sketch.toDataURL());
        this.props.cancel();
    }

    color(event) {
        event.preventDefault();
        this.setState({ showModal: true });
    }

    cancel(event) {
        event.preventDefault();
        this.props.cancel();
    }

    close() {
        this.setState({ showModal: false });
    }

    pencil() {
        this.setState({ tool: Tools.Pencil });
    }

    circle() {
        this.setState({ tool:  Tools.Circle });
    }

    rectangle() {
        this.setState({ tool:  Tools.Rectangle });
    }

    pan() {
        this.setState({ tool:  Tools.Pan });
    }

    handleFontChangeComplete(color,event){
        event.preventDefault();
        this.setState({ lineColor: color.hex });
    };

    render(){
        return (
            <div id="chatMessagesContainer">
                <SketchField
                    name='sketch'
                    className='canvas-area'
                    ref={(c) => this._sketch = c}
                    lineColor={this.state.lineColor}
                    lineWidth={this.state.lineWidth}
                    fillColor={this.state.fillWithColor ? this.state.fillColor : 'transparent'}
                    backgroundColor={this.state.fillWithBackgroundColor ? this.state.backgroundColor : 'transparent'}
                    width="100%"
                    style={test}
                    height='95%'
                    tool={this.state.tool}
                />
                <Modal
                    aria-labelledby='modal-label'
                    style={modalStyle}
                    backdropStyle={backdropStyle}
                    show={this.state.showModal}
                    onHide={this.close}>
                    <SketchPicker
                        color={ this.state.lineColor }
                        onChangeComplete={ this.handleFontChangeComplete }>
                    </SketchPicker>
                </Modal>

                <div id="chatMessagesBottom">
                    <button id="customButton" onClick={this.send}>Send</button>
                    <button id="customButton" onClick={this.clear}>Clear</button>
                    <button id="customButton" onClick={this.undo}>Undo</button>
                    <button id="customButton" onClick={this.redo}>Redo</button>
                    <button id="customButton" onClick={this.color}>Color</button>
                    <button id="customButton" onClick={this.pencil}>Pencil</button>
                    <button id="customButton" onClick={this.circle}>Circle</button>
                    <button id="customButton" onClick={this.rectangle}>Rectangle</button>
                    <button id="customButton" onClick={this.pan}>Pan</button>
                    <button id="customButton" onClick={this.cancel}>Cancel</button>
                </div>
            </div>
        );
    }
}
