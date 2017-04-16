import React, { Component, PropTypes } from 'react';
import { AllGroups } from '../api/allGroups.js';
export default class PendingGroups extends Component {

    handleClick(event){
        event.preventDefault();
    }

    allGroups(){
        return AllGroups.find().fetch();
    }

    handleAccept(event){
        event.preventDefault();
        let invited = [];
        let temp = [];
        let members = this.props.groupName.members;
        invited = this.props.groupName.invited;
        for(i = 0; i<invited.length; i++){
            if(invited[i] !== this.props.uname){
                temp.push(invited[i]);
            }
        }
        invited = temp;
        members.push(this.props.uname);

        // update on server
        Meteor.call("updateGroupMembers", this.props.groupName._id, members);
        Meteor.call("updateGroupInvited", this.props.groupName._id, invited); ///
    }

    getGroupOwner(id){
        for(i = 0; i< this.allGroups().length; i++){
            if(this.allGroups()[i]._id === id){
                return this.allGroups()[i].owner;
            }
        }
        return null;
    }

    render() {
        if(this.props.groupName.invited.indexOf(this.props.uname) > -1){
            return (
                <li><a href="" onClick={this.handleClick.bind(this)}> {this.props.groupName.groupName} </a> <img src="/images/check-small.png" onClick={this.handleAccept.bind(this)}/></li>
            );
        }else{
            return null;
        }
    }
}

PendingGroups.propTypes = {
    groupName: PropTypes.object.isRequired,
};