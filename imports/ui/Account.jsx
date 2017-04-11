import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { AllUsers } from '../api/allUsers.js';
import {Link} from "react-router-dom";
import { browserHistory } from 'react-router'

class Account extends Component {


    allUsers(){
        return AllUsers.find().fetch();
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

        if(password.length == 0){
            console.log("You must enter passwors");
            event.target.pass1.style.background = "#800000";
            flag = false;
        }else{ // password not empty
            event.target.pass1.style.background = "#6e7e8b";
            // need to check for password authentication
            if(this.authenticateUser(currentUname, password)){
                console.log("User Authenticated");
                // user is authenticated
                event.target.pass1.style.background = "#6e7e8b";
                if(newUname.length >0){
                    console.log("TEST");
                    if(this.validUsername(newUname)){
                        event.target.username.style.background = "#00b300";
                        Meteor.call("updateUsername", this.allUsers()[this.getUnameIndex(currentUname)]._id, newUname );
                        console.log("Username Changed");
                        this.props.match.params.value = newUname;
                    }
                    else{
                        event.target.username.style.background = "#800000";
                        console.log("username is not valid");
                        flag = false;
                    }

                }

                if(newEmail.length > 0){
                    if(this.validEmail(newEmail)){
                        event.target.email.style.background = "#00b300";
                        Meteor.call("updateEmail", this.allUsers()[this.getUnameIndex(currentUname)]._id, newEmail );
                        console.log("Email Changed");
                        this.render();
                    }else{
                        event.target.email.style.background = "#800000";
                        console.log("Email not unique");
                        flag = false;
                    }
                }

                if(newPass1.length > 0 && newPass2.length > 0){

                    if(newPass1 === newPass2){
                        event.target.pass2.style.background = "#00b300";
                        event.target.pass3.style.background = "#00b300";
                        Meteor.call("updatePassword", this.allUsers()[this.getUnameIndex(currentUname)]._id, newPass1 );
                        console.log("Password Changed");
                    }else{
                        event.target.pass2.style.background = "#800000";
                        event.target.pass3.style.background = "#800000";
                        console.log("Passwords dont match");
                        flag = false;
                    }
                }
            }else{
                console.log("Password Incorrect");
                event.target.pass1.style.background = "#800000";
                flag = false;
            }
        }
        if(flag){
            if(newUname.length == 0){
                newUname = this.props.match.params.value;
            }
            this.props.history.push({pathname:'/chatPage',
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


    render() {
        return(

            <div className="Main">
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
                                </div>
                                <div className="UItem1">
                                    New Username: <input id="uname" name="username" type="text" placeholder="example"/>
                                </div>
                                <div className="UItem2">
                                    New Email: <input id="uname" name="email" type="text" placeholder="example@example.com"/>
                                </div>
                                <div className="UItem3">
                                    New Password: <input id="uname" name="pass2" type="password" placeholder="*************"/>
                                </div>
                                <div className="UItem4">
                                    Re-enter password: <input id="uname" name="pass3" type="password" placeholder="*************"/>
                                </div>
                                <div className="register">
                                    <br></br> <input type="submit" value="Save Changes" id="register"/>
                                </div>
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