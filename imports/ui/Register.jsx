import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { AllUsers } from '../api/allUsers.js';
import {Link} from "react-router-dom";
class Register extends Component {
    constructor(){
        super();

    }

    allUsers(){
        return AllUsers.find().fetch();
    }

    verifyUsername(uname){
        let flag = true;

        for(var i = 0; i< this.allUsers().length; i++){
            if(this.allUsers()[i].uname === uname){
                flag = false;
            }
        }
        return flag;
    }

    handleSubmit(event){
        event.preventDefault();
        let username = event.target.username.value;
        username = username.toLowerCase();
        let email = event.target.email.value;
        let pass1 = event.target.pass1.value;
        let pass2 = event.target.pass2.value;
        if(username.length > 0 && email.length > 0 && pass1.length > 0 && pass2.length > 0){

            if(pass1 === pass2){
                if(this.verifyUsername(username)){
                    Meteor.call("addNewUser", {uname: username, email: email, pass: pass1});
                    console.log("Added: "+username+"  "+pass1+ "  "+email);
                    this.props.history.push('/');
                }else{
                    console.log("Username Already Taken");
                }

            }else{

                console.log("Passwords dont match");
            }
        }else{

        }
    }

    render() {
        return(
            <div className="Main">
                <div className="fieldContainer">
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <div className="registrationField">
                            <div className="UItem1">
                                Username: <input id="uname" name="username" type="text" placeholder="example"/>
                            </div>
                            <div className="UItem2">
                                Email: <input id="uname" name="email" type="text" placeholder="example@example.com"/>
                            </div>
                            <div className="UItem3">
                                Password: <input id="uname" name="pass1" type="password" placeholder="*************"/>
                            </div>
                            <div className="UItem4">
                                Re-enter password: <input id="uname" name="pass2" type="password" placeholder="*************"/>
                            </div>
                            <div className="register">
                                <br></br> <input type="submit" value="Register" id="register"/>

                            </div>

                            <div>
                                <br></br>Already have an account? <Link to="/">Sign-in</Link>
                            </div>
                        </div>
                    </form>
                </div>

            </div>
            );

    }
}

Register.propTypes = {
    allUsers: PropTypes.array.isRequired,
};

export default createContainer(() => {
    return {
        allUsers: AllUsers.find({}).fetch(),
    }
}, Register);