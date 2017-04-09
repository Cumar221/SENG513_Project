import React, { Component, PropTypes } from 'react';
import dateFormat from 'dateformat';

// Message component - represents a single todo item
export default class Message extends Component {
    render() {
        let time = new Date(this.props.message.createdAt.getTime());
        let text = this.props.message.text;
        let file = this.props.message.file;

        if(file != undefined){
            if(file.endsWith(".pdf")){
                return (
                    <li>[{dateFormat(time, "dddd, mmmm dS, yyyy, h:MM:ss TT")}] <br/>
                        <embed src={file} width="800px" height="800px" />
                    </li>
                );
            }
            else{
                return (
                    <li>[{dateFormat(time, "dddd, mmmm dS, yyyy, h:MM:ss TT")}] <br/>
                        <img className="imgPreview" src= {file}/>
                    </li>
                );
            }
        }

        return (
            <li>[{dateFormat(time, "dddd, mmmm dS, yyyy, h:MM:ss TT")}] <br/> {text}</li>
        );
    }
}

Message.propTypes = {
    // This component gets the message to display through a React prop.
    // We can use propTypes to indicate it is required
    message: PropTypes.object.isRequired,
};