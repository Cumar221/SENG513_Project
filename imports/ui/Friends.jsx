import React, { Component, PropTypes } from 'react';
import {AllUsers} from "../api/allUsers.js";

export default class Friends extends Component {

    allUsers(){
        return AllUsers.find().fetch();
    }

    getUnameIndex(uname){
        let index = -1;
        for(var i = 0; i<this.allUsers().length; i++){
            if(this.allUsers()[i].uname === uname){
                index = i;
                break;
            }
        }
        return index;
    }

    getFriends(uname){
        friends = [];
        for(i = 0; i<this.allUsers().length; i++){
            if(this.allUsers()[i].uname === uname){
                friends = this.allUsers()[i].friends;
                break;
            }

        }

        return friends;
    }

    handleClick(event){
        event.preventDefault();
        let friends = [];
        friends = this.getFriends(this.props.uname);
        friends.splice(friends.indexOf(this.props.allUsers), 1);

        Meteor.call("addFriend", this.allUsers()[this.getUnameIndex(this.props.uname)]._id, friends);
    }
    render() {

        return (

            <li><a href="" onClick={this.handleClick.bind(this)}> {this.props.allUsers} </a><img src="/images/X.png" onClick={this.handleClick.bind(this)}/></li>
        );
    }
}

Friends.propTypes = {
    allUsers: PropTypes.object.isRequired,
};