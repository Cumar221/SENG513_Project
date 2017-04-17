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

    verifyEmail(email){
        let flag = true;

        for(var i = 0; i< this.allUsers().length; i++){
            if(this.allUsers()[i].email === email){
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
		    let secret = event.target.secret.value;
        this.resetColors(event);
        this.resetEmptyErrors(event);
        this.takenEmail(false);
        this.takenUsername(false);
        this.notMatching(false);

        if(username.length > 0 && email.length > 0 && pass1.length > 0 && pass2.length > 0){

            if(pass1 === pass2){
                if(this.verifyUsername(username)){
                    if(this.verifyEmail(email)){
                        Meteor.call("addNewUser", {uname: username, email: email, pass: pass1, secret: secret});
                        console.log("Added: "+username+"  "+pass1+ "  "+email);
                        this.props.history.push('/');
                    }else{
                        console.log("email Already Taken");
                        this.takenEmail(true);

                    }

                }else{
                    console.log("Username Already Taken");
                    this.takenUsername(true);
                }

            }else{

                console.log("Passwords dont match");
                this.notMatching(true);

            }
        }else{

          if (username.length === 0) {
            event.target.username.style.background = "#800000";
            this.emptyUsername();
          }

          if (email.length === 0) {
            event.target.email.style.background = "#800000";
            this.emptyEmail();
          }

          if (pass1.length === 0) {
            event.target.pass1.style.background = "#800000";
            this.emptyPass1();
          }

          if (pass2.length === 0) {
            event.target.pass2.style.background = "#800000";
            this.emptyPass2();
          }

        }
    }

    resetColors(event){
        event.target.username.style.background = "#6e7e8b";
        event.target.email.style.background = "#6e7e8b";
        event.target.pass1.style.background = "#6e7e8b";
        event.target.pass2.style.background = "#6e7e8b";
    }

    resetEmptyErrors(event) {
      document.getElementById('emptyUsrname').style.display = 'none';
      document.getElementById('emptyEm').style.display = 'none';
      document.getElementById('emptyPass1').style.display = 'none';
      document.getElementById('emptyPass2').style.display = 'none';

    }

    emptyUsername() {
      document.getElementById('emptyUsrname').style.display = 'inline';
    }

    emptyEmail() {
      document.getElementById('emptyEm').style.display = 'inline';

    }

    emptyPass1() {
      document.getElementById('emptyPass1').style.display = 'inline';

    }

    emptyPass2() {
      document.getElementById('emptyPass2').style.display = 'inline';

    }

    takenUsername(exists) {

      if (exists) {
        document.getElementById('takenUsrname').style.display = 'inline';

      }

      else {
        document.getElementById('takenUsrname').style.display = 'none';
      }

    }

    takenEmail(exists) {

      if (exists) {
        document.getElementById('takenEm').style.display = 'inline';

      }

      else {
        document.getElementById('takenEm').style.display = 'none';
      }
    }

    notMatching(passwordsNotMatching) {

      if (passwordsNotMatching) {
        document.getElementById('nonMatch').style.display = 'inline';
      }

      else {
        document.getElementById('nonMatch').style.display = 'none';
      }
    }

    render() {
        return(
            <div className="Register">
              <div id="registration">
                <h1>Registration.</h1>
              </div>
                <div className="fieldContainer">
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <div className="registrationField">
                            <div className="UItem1">
                                Username: <input id="uname" name="username" type="text" placeholder="example"/>
                                <div id="emptyUsrname">
                                  <p>Enter a username</p>
                                </div>
                                <div id="takenUsrname">
                                  <p>Username is already taken</p>
                                </div>
                            </div>
                            <div className="UItem2">
                                Email: <input id="uname" name="email" type="text" placeholder="example@example.com"/>
                                <div id="emptyEm">
                                    <p>Enter an email</p>
                                  </div>
                                  <div id="takenEm">
                                    <p>Email is already used</p>
                                  </div>
                            </div>
                            <div className="UItem3">
                                Password: <input id="uname" name="pass1" type="password" placeholder="*************"/>
                                <div id="emptyPass1">
                                    <p>Enter a password</p>
                                  </div>
                            </div>
                            <div className="UItem4">
                                Re-enter password: <input id="uname" name="pass2" type="password" placeholder="*************"/>
                                <div id="emptyPass2">
                                    <p>Re-enter your password</p>
                                  </div>
                            </div>
                            <div id="nonMatch">
                                <p>The passwords do not match</p>
                              </div>
							<br></br>
							<div> Secret Question: What city were you born in? </div>
							<div className="UItem5">
                                Answer: <input id="uname" name="secret" type="password" placeholder="city"/>
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
