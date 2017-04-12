import React, { Component, PropTypes } from 'react';
import dateFormat from 'dateformat';

export default class Message extends Component {
    render() {
        let time = new Date(this.props.message.createdAt.getTime());
        let text = this.props.message.text;
        let file = this.props.message.file;
        let username =  this.props.message.uname;

        var messageStyle;

        if(username === this.props.uname){
            messageStyle = {
                color: "white",
                background: '#2770e5',
                marginLeft: '50%',
                border: '2px solid #2770e5',
            };
        }
        else{
            messageStyle = {
            };
        }


        if(file != undefined){
            if(file.endsWith(".pdf")){
                return (
                    <li style={messageStyle} >[{dateFormat(time, "dddd, mmmm dS, yyyy, h:MM:ss TT")}] {username}: <br/>
                        <embed src={file} width="800px" height="800px" />
                    </li>
                );
            }
            else{
                return (
                    <li style={messageStyle}>[{dateFormat(time, "dddd, mmmm dS, yyyy, h:MM:ss TT")}] {username}: <br/>
                        <img className="imgPreview" src= {file}/>
                    </li>
                );
            }
        }

        return (
            <li style={messageStyle}>[{dateFormat(time, "dddd, mmmm dS, yyyy, h:MM:ss TT")}] {username}: <br/> {text}</li>
        );
    }
}

Message.propTypes = {
    // This component gets the message to display through a React prop.
    // We can use propTypes to indicate it is required
    message: PropTypes.object.isRequired,
};