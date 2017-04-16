import React, { Component, PropTypes } from 'react';

export default class GroupUsers extends Component {
    render() {
        return (
            <li> {this.props.onlineUser} </li>
        );
    }
}

GroupUsers.propTypes = {
    onlineUser: PropTypes.object.isRequired,
};