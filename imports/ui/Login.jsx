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

        }
        else{
            console.log("Password or Useername Empty");
        }

        console.log("Authentication: "+ verify);

        if(verify == true) {
            this.props.history.push({pathname:'/chatPage',
                                     state:{currentUID: uname}});
        }
    }
    render() {
        return(
            <div className="Main">
                <form onSubmit= {this.handleSubmit.bind(this)}>
                    <div className="userField">
                        Username: <input id="uname" name="username" type="text" placeholder="example@example.com"/>
                        <br></br>
                        <br></br>
                        Password: <input id="pass" name="password" type="password" placeholder="***********"/>
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