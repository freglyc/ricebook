import React from 'react';
import { connect } from "react-redux";
import { Link, Redirect } from 'react-router-dom'
import { logout, getArticles, search } from "../redux/actions";
import '../style.css';

function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch(logout()),
        getArticles:() => dispatch(getArticles()),
        search: filter => dispatch(search(filter))
    };
}

class Navbar extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleClick() {
        this.props.logout();
        return <Redirect to="/"/>
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.getArticles().then(() => this.props.search({"filter": document.getElementById("search-field").value}));
    }

    render() {
        return (
            <nav className="navbar bg-orange justify-content-start" id="nav">
                <div className="container">
                    <div id="nav-left">
                        <Link to="/home" className="" id="home">
                            <span id="r">r</span>
                        </Link>
                        <form id="search-bar" onSubmit={this.handleSubmit} className="form-inline">
                            <input id="search-field" type="text" placeholder="search posts"/>
                            <input type="submit" className="hidden"/>
                        </form>
                    </div>

                    <div id="nav-right">
                        <Link to="/profile" className="nav-btn">
                            <svg enableBackground="new 0 0 515.556 515.556" height="512" viewBox="0 0 258.75 258.75" width="512" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="129.375" cy="60" r="60"/>
                                <path d="M129.375,150c-60.061,0-108.75,48.689-108.75,108.75h217.5C238.125,198.689,189.436,150,129.375,150z"/>
                            </svg>
                            profile
                        </Link>
                        <button name='logout' className="nav-btn" onClick={this.handleClick}>
                            <svg enableBackground="new 0 0 515.556 515.556" height="512" viewBox="0 0 515.556 515.556" width="512" xmlns="http://www.w3.org/2000/svg">
                                <path d="m322.222 451.111h-257.778v-386.667h257.778v32.222h64.444v-96.666h-386.666v515.556h386.667v-96.667h-64.444v32.222z"/>
                                <path d="m396.107 138.329-45.564 45.564 41.662 41.662h-166.65v64.445h166.65l-41.662 41.662 45.564 45.564 119.449-119.449z"/>
                            </svg>
                            logout
                        </button>
                    </div>
                </div>
            </nav>
        )
    }
}

export default connect(null, mapDispatchToProps)(Navbar);