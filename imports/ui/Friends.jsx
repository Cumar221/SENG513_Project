import React, { Component, PropTypes } from 'react';

export default class Friends extends Component {

    handleClick(event){
        event.preventDefault();
    }
    render() {
        return (

            <li><a href="" onClick={this.handleClick.bind(this)}> {this.props.allUsers} </a></li>
        );
    }
}

Friends.propTypes = {
    allUsers: PropTypes.object.isRequired,
};