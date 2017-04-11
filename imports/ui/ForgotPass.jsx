import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { AllUsers } from '../api/allUsers.js';
import {Link} from "react-router-dom";
import { browserHistory } from 'react-router'

class ForgotPass extends Component {
    allUsers(){
        return AllUsers.find().fetch();
    }

    render() {
        return(
            <div>
                TEST
            </div>
        )
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