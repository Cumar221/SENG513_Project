import React, { Component, PropTypes } from 'react';

export default class Groups extends Component {

    handleClick(event){
        event.preventDefault();
    }
    render() {
        console.log("Owner: "+this.props.groupName.owner);
        console.log("Actual Owner: "+this.props.uname);
        if(this.props.groupName.owner === this.props.uname){
            return (

                <li><a href="" onClick={this.handleClick.bind(this)}> {this.props.groupName.groupName} </a></li>
            );
        }else{
            return null;
            console.log();
        }



    }
}

Groups.propTypes = {
    groupName: PropTypes.object.isRequired,
};