import React, { Component, PropTypes } from 'react';
import dateFormat from 'dateformat';

// Message component - represents a single todo item
export default class Message extends Component {
    render() {
        let time = new Date(this.props.message.createdAt.getTime());
        let text = this.props.message.text;
        let image = this.props.message.image;

        console.log("------------------------->" + text );
        console.log("llllllllllllllllllllllllll" + image );

        if(image != undefined){
            if(image.endsWith(".pdf")){
                return (
                    <li>[{dateFormat(time, "dddd, mmmm dS, yyyy, h:MM:ss TT")}] <br/>
                        <embed src={image} width="800px" height="800px" />
                    </li>
                );
            }
            else{
                return (
                    <li>[{dateFormat(time, "dddd, mmmm dS, yyyy, h:MM:ss TT")}] <br/>
                        <img className="imgPreview" src= {image}/>
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