import React, { Component } from 'react';
import {Switch, Route, HashRouter, Redirect} from 'react-router-dom';
import Landing from '../pages/landing/Landing';
import Main from "../pages/main/Main";
import Profile from "../pages/profile/Profile";
import {connect} from "react-redux";
import {checkLogin} from "../redux/actions/index";


const mapStateToProps = state => {
    return { username: state.username };
};

function mapDispatchToProps(dispatch) {
    return {
        checkLogin: () => dispatch(checkLogin()),
    };
}

class ConnectedAllRoutes extends Component {

    componentDidMount() {
        this.props.checkLogin()
    }

    render() {
        const isLoggedIn = this.props.username !== '';
            return (
                <HashRouter>
                    <Switch>
                        <PrivateRoute exact path='/home' component={Main} loggedIn={isLoggedIn}/>
                        <PrivateRoute exact path='/profile' component={Profile} loggedIn={isLoggedIn}/>
                        <NonPrivateRoute path='/' component={Landing} loggedIn={isLoggedIn}/>
                    </Switch>
                </HashRouter>
            )
    }
}

const NonPrivateRoute = ({ component: Component, loggedIn }) => (
    <Route path='/' render={() => (
        loggedIn === false
            ? <Component />
            : <Redirect to='/home'/>
    )} />
);

const PrivateRoute = ({ path, component: Component, loggedIn }) => (
    <Route exact path={path} render={() => (
        loggedIn === true
            ? <Component />
            : <Redirect to='/'/>
    )} />
);

const AllRoutes = connect(mapStateToProps, mapDispatchToProps)(ConnectedAllRoutes);

export default AllRoutes;