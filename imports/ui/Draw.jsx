import React, { Component, PropTypes } from 'react';
import {SketchField, Tools} from 'react-sketch';

export default class Draw extends Component{
    constructor(props) {
        super(props);
        this.state = {
            lineColor: 'black',
            lineWidth: 10,
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
            originY: 'top'
        };

        this.clear   = this.clear.bind(this);
        this.undo    = this.undo.bind(this);
        this.redo    = this.redo.bind(this);
        this.send    = this.send.bind(this);
        this.cancel  = this.cancel.bind(this);
    }

    clear(event){
        event.preventDefault();
        console.log("hello");
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

    send(event) {
        event.preventDefault();

    }

    cancel(event) {
        event.preventDefault();
        console.log("cancel");
        this.props.cancel();
    }

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
                    height='95%'
                    tool={this.state.tool}
                />

                <div id="chatMessagesBottom">
                    <button id="customButton" onClick={this.send}>Send</button>
                    <button id="customButton" onClick={this.clear}>Clear</button>
                    <button id="customButton" onClick={this.undo}>Undo</button>
                    <button id="customButton" onClick={this.redo}>Redo</button>
                    <button id="customButton" onClick={this.cancel}>Cancel</button>
                </div>
            </div>
        );
    }
}
