import React from 'react';
import { connect } from "react-redux";
import { login } from "../../redux/actions/index";
import '../../style.css';

function mapDispatchToProps(dispatch) {
    return {
        login: (username, password) => dispatch(login(username, password)),
    };
}

export class Login extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            error: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() { this._isMounted = true; }
    componentWillUnmount() { this._isMounted = false; }
    handleChange(event) { this.setState({ [event.target.id]: event.target.value }); }

    handleSubmit = event => {
        event.preventDefault();
        const { username, password } = this.state;
        this.props.login(username, password).then(error => {
            if (this._isMounted) { this.setState({error: error }); }
        });
    };

    render() {
        const { username, password, error } = this.state;
        return (
            <nav className="navbar bg-orange justify-content-start" id="login-nav">
                <div className="container">
                    <a id="ricebook" href="."><h1>ricebook</h1></a>
                    <div id="login-form">
                        <form noValidate onSubmit={this.handleSubmit}>
                            <span>{error}</span>
                            <input id="username" className="input login-input" type="text" placeholder="username" value={username} onChange={this.handleChange}/>
                            <input id="password" className="input login-input" type="password" placeholder="password" value={password} onChange={this.handleChange}/>
                            <button id="login-btn" type="submit">
                                <svg enableBackground="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="m322.222 451.111h-257.778v-386.667h257.778v32.222h64.444v-96.666h-386.666v515.556h386.667v-96.667h-64.444v32.222z"/>
                                    <path
                                        d="m396.107 138.329-45.564 45.564 41.662 41.662h-166.65v64.445h166.65l-41.662 41.662 45.564 45.564 119.449-119.449z"/>
                                </svg>
                                login
                            </button>
                        </form>
                    </div>
                </div>
            </nav>
        );
    }
}

export default connect(null, mapDispatchToProps)(Login);