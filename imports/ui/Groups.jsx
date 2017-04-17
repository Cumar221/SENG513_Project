import React, { Component, PropTypes } from 'react';
import { AllGroups } from '../api/allGroups.js';
export default class Groups extends Component {

    handleClick(event){
        event.preventDefault();

        this.props.showGroupChat(this.props.groupName._id);
    }

    allGroups(){
        return AllGroups.find().fetch();
    }


    handleClose(event){
        event.preventDefault();
        let owner = this.props.groupName.owner
        if(owner != null){
            if(this.props.uname === owner){ // owner closing group
                Meteor.call("removeGroup", this.props.groupName._id);
            }else{ // member leaving group
                let members = [];
                members = this.props.groupName.members;
                console.log(members);
                members.splice(members.indexOf(this.props.uname), 1);
                Meteor.call("addGroupMember", this.props.groupName._id, members);
            }
        }else{
            console.log("Group Does Not Exist")
        }
        this.props.hideGroupChat(this.props.uname);


    }

    getGroupOwner(id){
        for(i = 0; i< this.allGroups().length; i++){
            if(this.allGroups()[i]._id === id){
                return this.allGroups()[i].owner;
            }

        }

        return null;
    }

    checkHidden(){
        let flag = false;
        if(this.props.groupName.owner === this.props.uname){
            flag = true;
        }
        else if(this.props.groupName.admins.indexOf(this.props.uname) > -1){
            flag = true;
        }else{
            flag = false;
        }
        console.log(flag+"   owner: "+ this.props.groupName.owner+ "   uname: "+ this.props.uname);
        return flag;
    }
//
    handleOption(event){
        event.preventDefault();
        this.props.showEditGroup(this.props.groupName._id);
    }

    render() {
        if(this.props.groupName.members.indexOf(this.props.uname) > -1 || this.props.groupName.owner === this.props.uname){
            return (
                <li><a href="" onClick={this.handleClick.bind(this)}> {this.props.groupName.groupName} </a> <img className="gearBox"  src="/images/gear.png" hidden={!this.checkHidden()} onClick={this.handleOption.bind(this)}/> <img  src="/images/X.png" onClick={this.handleClose.bind(this)}/></li>
            );
        }else{
            return null;
        }
    }
}

Groups.propTypes = {
    groupName: PropTypes.object.isRequired,
};
