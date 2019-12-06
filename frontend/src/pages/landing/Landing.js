import React from 'react';
import { connect } from "react-redux";
import Login from './Login'
import Register from './Register'
import { loginPast } from "../../redux/actions/index";
import '../../style.css';

function mapDispatchToProps(dispatch) {
    return {
        loginPast: () => dispatch(loginPast())
    };
}

class Landing extends React.Component {

    componentDidMount() {
        this.props.loginPast();
    }

    render() {
        return (
            <div>
                <Login/>
                <div className="bg-main container">
                    <div className="row" id="landing-main">
                        <div id="graphic-container" className="col">
                            <Graphic/>
                        </div>
                        <div className="col">
                            <Register/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class Graphic extends React.Component {
    render() {
        return (
            <div>
                <img id="landing-graphic" src={require("../../resources/landing.svg")} alt="landing graphic"/>
            </div>
        );
    }
}

export default connect(null, mapDispatchToProps)(Landing);
