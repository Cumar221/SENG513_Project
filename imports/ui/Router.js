/**
 * Created by Shahab on 4/4/2017.
 */
import { render } from 'react-dom';
import React from "react";
import {BrowserRouter as Router, Route, browserHistory} from "react-router-dom";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import ChatPage from "./ChatPage.jsx";
import Account from "./Account.jsx";
import ForgotPass from "./ForgotPass.jsx";

Meteor.startup(() => {
    function requireAuth(nextState, replace) {
            replace({
                pathname: '/'
            })
        }

    render(
        <Router history={browserHistory}>
            <div>
                <Route exact={true} path="/" component={Login} />
                <Route path="/register" component={Register}  onEnter={requireAuth}/>
                <Route path="/forgotPass" component={ForgotPass} />
                <Route name="Account" path="/Account/:value" component={Account} />
                <Route name="ChatPage" path="/chatPage/:uname" component={ChatPage} />
            </div>
        </Router>,
        document.getElementById('render-target')
    );
});
