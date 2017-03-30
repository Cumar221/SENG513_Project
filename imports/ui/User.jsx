import React, { Component, PropTypes } from 'react';

export default class User extends Component {
    render() {
        var you = "";

        if(this.props.user.username === this.props.test){
           you = " (you)";
        }

        return (
            <li> {this.props.user.username} {you} </li>
        );
    }
}

User.propTypes = {
    user: PropTypes.object.isRequired,
};