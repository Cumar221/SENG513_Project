import React, { Component, PropTypes } from 'react';
import dateFormat from 'dateformat';
import {emojify} from 'react-emojione';


export default class GroupMessage extends Component {
    render() {
        let time = new Date(this.props.message.createdAt.getTime());
        let text = this.props.message.text;
        let file = this.props.message.file;
        let username =  this.props.message.uname;
        var messageStyle;
        let groupMembers = this.props.groupMembers;
        let id = this.props.id;
        let messageID = this.props.message.targetGroupID;



        if(id === messageID){
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

            if(text != null || text != undefined) {
                return (
                    <li style={messageStyle}>[{dateFormat(time, "dddd, mmmm dS, yyyy, h:MM:ss TT")}] {username}:
                        <br/> {emojify(text)}</li>
                );
            }

            return null;

        }else{
            return null;
        }


    }
}

GroupMessage.propTypes = {
    // This component gets the message to display through a React prop.
    // We can use propTypes to indicate it is required
    message: PropTypes.object.isRequired,
};
