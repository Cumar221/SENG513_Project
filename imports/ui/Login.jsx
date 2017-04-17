import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { AllUsers } from '../api/allUsers.js';
import {Link} from "react-router-dom";
import { browserHistory } from 'react-router'

class Login extends Component {
    constructor(){
        super();
    }

    allUsers(){
        return AllUsers.find().fetch();
    }

    handleSubmit(event){
        event.preventDefault();
        let uname = event.target.username.value;
        uname = uname.toLowerCase();
        let password = event.target.password.value;
        let uname_found = false;
        let verify = false;
        this.resetColors(event);
        this.emptyUsername(false);
        this.emptyPassword(false);

        if(uname.length > 0 && password.length > 0){
            console.log(this.allUsers().length);
            for(var i = 0; i<this.allUsers().length; i++){

                if(this.allUsers()[i].uname === uname){
                    uname_found = true;
                    if(this.allUsers()[i].pass === password){
                        verify = true;
                    }
                }
            }

            console.log("Authentication: "+ verify);

            if(verify == true) {
                this.props.history.push({pathname:'/chatPage/'+uname,
                                         state:{currentUID: uname}});
            }

            else {
              //Unveil error message
              document.getElementById('invalidLogin').style.display = 'inline';
            }
        }
        else{
            console.log("Password or Username Empty");
            document.getElementById('invalidLogin').style.display = 'none';
        }

        if (uname.length === 0) {
          event.target.username.style.background = "#800000";
          this.emptyUsername(true);
        }
    }

    resetColors(event){
        event.target.username.style.background = "#6e7e8b";
        event.target.password.style.background = "#6e7e8b";
    }

    emptyUsername(empty){

        if (empty) {
            document.getElementById('emptyUsrname').style.display = 'inline';
        }

        else {
            document.getElementById('emptyUsrname').style.display = 'none';
        }

    }

    emptyPassword(empty) {

        if (empty) {
            document.getElementById('emptyPass').style.display = 'inline';

        }

        else {
            document.getElementById('emptyPass').style.display = 'none';
        }

    }

    resetColors(event) {
        event.target.username.style.background = "#6e7e8b";
        event.target.password.style.background = "#6e7e8b";

    }

    emptyUsername(empty) {

        if (empty) {
            document.getElementById('emptyUsrname').style.display = 'inline';
        }

        else {
            document.getElementById('emptyUsrname').style.display = 'none';
        }

    }

    emptyPassword(empty) {

        if (empty) {
            document.getElementById('emptyPass').style.display = 'inline';

        }

        else {
            document.getElementById('emptyPass').style.display = 'none';
        }
    }

    emptyPassword(empty) {
      if (empty) {
        document.getElementById('emptyPass').style.display = 'inline';
      }
      else {
        document.getElementById('emptyPass').style.display = 'none';
      }
    }

    render() {
        return(
            <div className="Main">
            <div id="title">
              <h1>Welcome to Slingshot Messenger.</h1>
            </div>
            <div id="logo">
              <img src="/images/logo.jpg"/>
            </div>
                <form onSubmit= {this.handleSubmit.bind(this)}>
                    <div className="userField">
                        <div id="invalidLogin">
                            <p>Incorrect username or password!</p>
                        </div>
                        Username: <input id="uname" name="username" type="text" placeholder="example@example.com"/>
                        <div id="emptyUsrname">
                            <p>Please enter a username</p>
                        </div>
                        <br></br>
                        <br></br>
                        Password: <input id="pass" name="password" type="password" placeholder="***********"/>
                        <div id="emptyPass">
                            <p>Please enter a password</p>
                        </div>
                        <br></br>
                    </div>
                    <br></br>
                    <div className="logInButton">
                        <Link to="/forgotPass">Forgot your password?</Link>
                        <br></br>
                        <br></br>
                        <input type="submit" value="Login" name="login" id="login"/>
                        <br></br>
                        <br></br>
                        New User? <Link to="/register">Register Here</Link>
                    </div>
                </form>
            </div>
        );
    }
}






Login.propTypes = {
    allUsers: PropTypes.array.isRequired,
};

export default createContainer(() => {
    return {
        allUsers: AllUsers.find({}).fetch(),
    }
}, Login);
