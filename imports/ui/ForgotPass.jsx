import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { AllUsers } from '../api/allUsers.js';
import {Link} from "react-router-dom";


class ForgotPass extends Component {
	
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
	
	handleSubmit(event){
		event.preventDefault();
		let userName = event.target.username.value;
		let secret = event.target.secret.value;
		let newPassword = event.target.newPassword.value;
		let flag = false;
		
		for(var i = 0; i< this.allUsers().length; i++){
			console.log("Inputed userName vs database uname: " + userName + "//" + this.allUsers()[i].uname);
			console.log("Inputed secret vs database secret: " + secret + "//" + this.allUsers()[i].secret)
            if(this.allUsers()[i].uname === userName){
                if(this.allUsers()[i].secret === secret){
					console.log("secret key is correct");
					flag = true;
				}
            }
        }
		
		if(flag == true){
			Meteor.call("updatePassword", this.allUsers()[this.getUnameIndex(userName)]._id, newPassword );
			window.history.back();
			//If you want to get to main page instead
			//this.props.history.push({pathname:'/chatPage', state:{currentUID: userName}});
		}
		else{
			console.log("secret key is not correct or user does not exist");
			//document.getElementById('error').innerHTML("Incorrect answer or nonexistent user");
		}
	}

	
	
    render() {
        return(
            <div className="wrapper">
			  <div className="Main">
				<form onSubmit= {this.handleSubmit.bind(this)}>
					<div className="userField">
						<p><label htmlFor="uname">Username:</label> <input id="uname" name="username" type="text" placeholder=""/></p>
						<h3>What city were you born in?</h3>
						<p><label htmlFor="pass">Answer:</label> <input id="pass" name="secret" type="password" placeholder=""/></p>
						<p><label htmlFor="">New Password:</label> <input id="pass" name="newPassword" type="password" placeholder=""/></p>
					</div>

					<div className="resetButton">
						<input type="submit" value="Reset Password" name="reset" id="reset"/>
					</div>
				</form>

				<p>New User?<Link to="/register"> Register Here</Link></p>
				<p>Remember your password? <Link to="/">Sign-in</Link></p>
				</div>
				<div id="error">
					
				</div>
			</div>

        );
    }
}

ForgotPass.propTypes = {
    allUsers: PropTypes.array.isRequired,
};

export default createContainer(() => {
    return {
        allUsers: AllUsers.find({}).fetch(),
    }
}, ForgotPass);