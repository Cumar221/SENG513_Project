import React, { Component, PropTypes } from 'react';

export default class OnlineUser extends Component {
    render() {
        return (
            <li> {this.props.onlineUser.uname} </li>
        );
    }
}

OnlineUser.propTypes = {
    onlineUser: PropTypes.object.isRequired,
};