import React from "react";
import {connect} from "react-redux";
import {
    getFollowing,
    follow,
    unfollow,
    getArticles,
    getOtherDisplay,
    getOtherStatus,
    getOtherAvatar
} from "../../redux/actions";
import '../../style.css';

function mapStateToProps(state) {
    return {
        following: state.following
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getFollowing: () => dispatch(getFollowing()),
        follow: username => dispatch(follow(username)),
        unfollow: username => dispatch(unfollow(username)),
        getArticles: () => dispatch(getArticles())
    };
}

class Followed extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.getFollowing();
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.follow(document.getElementById("follow-user").value)
            .then(result => this.setState({error: result}))
            .then(() => this.props.getArticles());
        document.getElementById("follow-user").value = '';
    }

    render() {
        return (
            <div className="status-card" id="friends">
                <p className="header-txt">Following</p>
                <div id="friends-cards">
                    { this.props.following === undefined || this.props.following.length === 0 ? <p/> : this.props.following.map(username => (<Card key={username} username={username}/>))}
                </div>
                <form onSubmit={this.handleSubmit} className="status-update">
                    <input id="follow-user" className="status-input" placeholder="follow user" type="text"/>
                    <button className="status-set" type="submit">add</button>
                    <p id="follow-error">{this.state.error}</p>
                </form>
            </div>
        )
    }
}

class ConnectedCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            display: '',
            status: '',
            avatar: ''
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        getOtherDisplay(this.props.username).then(res => this.setState({ display: res }));
        getOtherStatus(this.props.username).then(res => this.setState({ status: res }));
        getOtherAvatar(this.props.username).then(res => this.setState({ avatar: res }))
    }

    handleClick(event) {
        event.preventDefault();
        this.props.unfollow(this.props.username).then(() => this.props.getArticles());
    }

    render() {
        return (
            <div id="card">
                <button onClick={this.handleClick} id="unfollow"/>
                <div id="inner-card">
                    <img src={this.state.avatar} alt="profile img" className="card_img"/>
                    <div id="card_info">
                        <p id="card_name">{this.state.display}</p>
                        <p id="card_status">{this.state.status}</p>
                    </div>
                </div>
            </div>
        )
    }
}

const Card = connect(mapStateToProps, mapDispatchToProps)(ConnectedCard);
export default connect(mapStateToProps, mapDispatchToProps)(Followed);