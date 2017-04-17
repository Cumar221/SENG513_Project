import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { AllUsers } from '../api/allUsers.js';
import { AllGroups } from '../api/allGroups.js';
import {Link} from "react-router-dom";
import { browserHistory } from 'react-router'

class Account extends Component {


    allUsers(){
        return AllUsers.find().fetch();
    }
    allGroups(){
        return AllGroups.find().fetch();
    }

    getUnameOwnerID(oldUname){
        let id = [];
        for(i = 0; i<this.allGroups().length; i++){
            if(this.allGroups()[i].owner === oldUname){
                id.push(this.allGroups()[i]._id);
            }
        }
        return id;
    }

    getUnameMemberID(oldUname, newUname){
        let id = [];
        for(i = 0; i<this.allGroups().length; i++){
            if(this.allGroups()[i].members.indexOf(oldUname) > -1){
                let mem = [];
                mem = this.allGroups()[i].members;
                temp = mem.splice(mem.indexOf(oldUname), 1);
                mem = temp;
                mem.push(newUname);

                id.push({id: this.allGroups()[i]._id, members: mem});
            }
        }
        return id;
    }



    handleSubmit(event){
        event.preventDefault();
        let currentUname = this.props.match.params.value;
        let newUname = event.target.username.value;
        let password = event.target.pass1.value;
        let newEmail = event.target.email.value;
        let newPass1 = event.target.pass2.value;
        let newPass2 = event.target.pass3.value;
        let flag = true;
        this.resetColors(event);
       // event.target.username.style.background = "#800000";
        //event.target.pass1.style.background = "#00b300";  //  #6e7e8b

        let currPassMsg = 0;
        let newUnameMsg = 1;
        let newEmailMsg = 2;
        let newPassMsg = 3;

        if (newUname.length === 0) {
          this.hideErrorMsg(newUnameMsg);
        }
        if (newEmail.length === 0) {
          this.hideErrorMsg(newEmailMsg);
        }
        if (newPass1.length === 0 && newPass2.length === 0) {
          this.hideErrorMsg(newPassMsg);
          this.newPassword(false);
        }

        if(password.length == 0){
            console.log("You must enter a password");
            event.target.pass1.style.background = "#800000";
            flag = false;
            this.showErrorMsg(currPassMsg);
          
        }else{ // password not empty
            event.target.pass1.style.background = "#6e7e8b";
            // need to check for password authentication
            if(this.authenticateUser(currentUname, password)){
                console.log("User Authenticated");
                this.hideErrorMsg(currPassMsg);
                // user is authenticated
                event.target.pass1.style.background = "#00b300";

                if(newUname.length >0){
                  this.noChangesMessage(false);
                    console.log("TEST");
                    if(this.validUsername(newUname)){
                      this.hideErrorMsg(newUnameMsg);

                        event.target.username.style.background = "#00b300";
                        Meteor.call("updateUsername", this.allUsers()[this.getUnameIndex(currentUname)]._id, newUname );

                        ////////// Update All Groups Owners//////////
                        let id = [];
                        id = this.getUnameOwnerID(currentUname);
                        if(id.length != 0){
                            for(i = 0; i< id.length; i++){
                                Meteor.call("updateGroupOwner", id[i], newUname );
                            }
                        }
                        ///////// Update All Groups Members ////////
                        let memberAndID = this.getUnameMemberID(currentUname, newUname);
                        if(memberAndID.length != 0){
                            for(i = 0; i< memberAndID.length; i++){
                                Meteor.call("updateGroupMembers", memberAndID[i].id, memberAndID[i].members );
                            }
                        }

                        console.log("Username Changed");
                        this.props.match.params.value = newUname;
                    }
                    else{
                        this.showErrorMsg(newUnameMsg);
                        event.target.username.style.background = "#800000";
                        console.log("username is not valid");
                        flag = false;
                    }

                }

                if(newEmail.length > 0){
                  this.noChangesMessage(false);
                    if(this.validEmail(newEmail)){
                        this.hideErrorMsg(newEmailMsg);
                        event.target.email.style.background = "#00b300";
                        Meteor.call("updateEmail", this.allUsers()[this.getUnameIndex(currentUname)]._id, newEmail );
                        console.log("Email Changed");
                        this.render();
                    }else{
                        this.showErrorMsg(newEmailMsg);
                        event.target.email.style.background = "#800000";
                        console.log("Email not unique");
                        flag = false;
                    }
                }

                if(newPass1.length > 0 || newPass2.length > 0){

                    this.noChangesMessage(false);

                  this.noChangesMessage(false);

                    if(newPass1 === newPass2){
                        this.hideErrorMsg(newPassMsg);

                        //Check to make sure its not current password
                        if (newPass1 === password) {
                          flag = false;
                          console.log("This new password matches the current one");
                          console.log("Use a different password");

                          this.newPassword(true);

                          event.target.pass2.style.background = "#800000";
                          event.target.pass3.style.background = "#800000";
                        }

                        else {
                          this.newPassword(false);
                          event.target.pass2.style.background = "#00b300";
                          event.target.pass3.style.background = "#00b300";
                          Meteor.call("updatePassword", this.allUsers()[this.getUnameIndex(currentUname)]._id, newPass1 );
                          console.log("Password Changed");
                        }
                    }else{
                        this.newPassword(false);
                        this.showErrorMsg(newPassMsg);
                        event.target.pass2.style.background = "#800000";
                        event.target.pass3.style.background = "#800000";
                        console.log("Passwords dont match");
                        flag = false;
                    }
                }

                if (newUname.length === 0
                  && newEmail.length === 0
                  && (newPass1.length === 0 && newPass2.length === 0)) {
                  console.log("No changes to save");
                  flag = false;
                  this.noChangesMessage(true);
                }
            }

            else{
                this.showErrorMsg(currPassMsg);
                console.log("Password Incorrect");
                event.target.pass1.style.background = "#800000";
                flag = false;
            }
        }

        if(flag){
            if(newUname.length == 0){
                newUname = this.props.match.params.value;
            }
            console.log();
            this.props.history.push({pathname:'/chatPage/'+newUname,
                state:{currentUID: newUname}});
        }

    }

    resetColors(event){
        event.target.username.style.background = "#6e7e8b";
        event.target.email.style.background = "#6e7e8b";
        event.target.pass1.style.background = "#6e7e8b";
        event.target.pass2.style.background = "#6e7e8b";
        event.target.pass3.style.background = "#6e7e8b";
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

    validUsername(uname){
        let flag = true;
        for(var i = 0; i<this.allUsers().length; i++){
            if(this.allUsers()[i].uname === uname){
               flag = false;
               break;
            }
        }
        return flag;
    }

    validEmail(newEmail){
        let flag = true;
        for(var i = 0; i<this.allUsers().length; i++){
            if(this.allUsers()[i].email === newEmail){
                flag = false;
                break;
            }
        }
        return flag;
    }

    authenticateUser(uname, password){
        let flag = false;
        for(var i = 0; i<this.allUsers().length; i++){
            if(this.allUsers()[i].uname === uname){
                if(this.allUsers()[i].pass === password){
                    flag = true;
                }
                else{
                    flag = false;
                }

            }
        }
        return flag;
    }
    getEmail(uname){
        let email = "";
        for(var i = 0; i<this.allUsers().length; i++){
            if(this.allUsers()[i].uname === uname){
                email = this.allUsers()[i].email;
            }
        }

        return email;
    }

	handleBack(){
		console.log("back");
        this.props.history.push({pathname:'/chatPage/'+this.props.match.params.value,
            state:{currentUID: this.props.match.params.value}});
	}

  hideErrorMsg(field) {
    /*
    *Hides error messages based on textbox field
    */
    let pass = 0;
    let usernameChange = 1;
    let emailChange = 2;

    if (field === pass) {
        document.getElementById('incorrectPassword').style.display = 'none';
    }

    else if (field === usernameChange) {
      document.getElementById('incorrectUsername').style.display = 'none';
    }

    else if (field === emailChange) {
      document.getElementById('incorrectEmail').style.display = 'none';
    }

    else {
      document.getElementById('nonMatch').style.display = 'none';

    }
  }

  showErrorMsg(field) {
    /*
    *Displays error messages based on textbox field
    */

    let incorrectPass = 0;
    let incorrectUsrname = 1;
    let incorrectEm = 2;

    if (field === incorrectPass){
      document.getElementById('incorrectPassword').style.display = 'inline';
    }

    else if (field === incorrectUsrname) {
      document.getElementById('incorrectUsername').style.display = 'inline';
    }

    else if (field === incorrectEm) {
      document.getElementById('incorrectEmail').style.display = 'inline';
    }

    else {
      document.getElementById('nonMatch').style.display = 'inline';
    }
  }

  noChangesMessage(emptyFields) {
    if (emptyFields) {
      document.getElementById('noChanges').style.display = 'inline';
    }

    else {
      document.getElementById('noChanges').style.display = 'none';
    }
  }

  newPassword(matchesOld) {

    if (matchesOld) {
      document.getElementById('matchesOldPass').style.display = 'inline';
    }

    else {
      document.getElementById('matchesOldPass').style.display = 'none';
    }
  }

    hideErrorMsg(field) {
      /*
      *Hides error messages based on textbox field
      */
      let pass = 0;
      let usernameChange = 1;
      let emailChange = 2;

      if (field === pass) {
          document.getElementById('incorrectPassword').style.display = 'none';
      }

      else if (field === usernameChange) {
        document.getElementById('incorrectUsername').style.display = 'none';
      }

      else if (field === emailChange) {
        document.getElementById('incorrectEmail').style.display = 'none';
      }

      else {
        document.getElementById('nonMatch').style.display = 'none';
      }
    }

    showErrorMsg(field) {
      /*
      *Displays error messages based on textbox field
      */

      let incorrectPass = 0;
      let incorrectUsrname = 1;
      let incorrectEm = 2;

      if (field === incorrectPass){
        document.getElementById('incorrectPassword').style.display = 'inline';
      }

      else if (field === incorrectUsrname) {
        document.getElementById('incorrectUsername').style.display = 'inline';
      }

      else if (field === incorrectEm) {
        document.getElementById('incorrectEmail').style.display = 'inline';
      }

      else {
        document.getElementById('nonMatch').style.display = 'inline';
      }
    }

    noChangesMessage(emptyFields) {
      if (emptyFields) {
        document.getElementById('noChanges').style.display = 'inline';
      }

      else {
        document.getElementById('noChanges').style.display = 'none';
      }
    }

    newPassword(matchesOld) {

      if (matchesOld) {
        document.getElementById('matchesOldPass').style.display = 'inline';
      }

      else {
        document.getElementById('matchesOldPass').style.display = 'none';
      }
    }

    render() {
        return(
            <div className="Account">
                <div className="fieldContainer">
                    <form onSubmit={this.handleSubmit.bind(this)}>
                            <div className="registrationField">
                                <p>Lets Edit Your Account</p>
                                <div className="usernameEmail">
                                    <p>Username: <input id="uname1" disabled="disabled" type="text" value={this.props.match.params.value}/></p>
                                    <p>Email: <input id="uname1" disabled="disabled" type="text" value={this.getEmail(this.props.match.params.value)}/></p>
                                </div>
                                <div className="UItem3">
                                    Password: <input id="uname" name="pass1" type="password" placeholder="*************"/>

                                    <div id="incorrectPassword">
                                      <p>Please enter a correct password</p>
                                    </div>
                                </div>
                                <div className="UItem1">
                                    New Username: <input id="uname" name="username" type="text" placeholder="example"/>
                                    <div id="incorrectUsername">
                                        <p>Cannot use this username</p>
                                    </div>
                                </div>
                                <div className="UItem2">
                                    New Email: <input id="uname" name="email" type="text" placeholder="example@example.com"/>
                                    <div id="incorrectEmail">
                                        <p>Cannot use this email</p>
                                    </div>
                                </div>
                                <div className="UItem3">
                                    New Password: <input id="uname" name="pass2" type="password" placeholder="*************"/>
                                </div>
                                <div className="UItem4">
                                    Re-enter password: <input id="uname" name="pass3" type="password" placeholder="*************"/>
                                    
                                    <div id="nonMatch">
                                        <p>The passwords you have entered do not match</p>
                                    </div>
                                    <div id="matchesOldPass">
                                        <p>New password matches current one!</p>
                                    </div>
                                </div>
                                <div className="register">
                                    <br></br> <input type="submit" value="Save Changes" id="register"/>
                                      <div id="noChanges">
                                          <p>There are no changes to be saved</p>
                                      </div>
                                </div>
                            </div>
                        </form>
                        <form onSubmit={this.handleBack.bind(this)}>
                            <div className="register">
                                  <br></br> <input type="submit" value="back" id="backButton"/>
                             </div>
		                    </form>
                    </div>
                </div>
        );
    }
}

Account.propTypes = {
    allUsers: PropTypes.array.isRequired,
};

export default createContainer(() => {
    return {
        allUsers: AllUsers.find({}).fetch(),
    }
}, Account);
