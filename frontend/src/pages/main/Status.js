import React from "react";
import { connect } from "react-redux";
import {getStatus, getDisplay, setStatus, getAvatar} from "../../redux/actions";
import '../../style.css';

function mapDispatchToProps(dispatch) {
    return {
        setStatus: status => dispatch(setStatus(status)),
        getStatus: () => dispatch(getStatus()),
        getDisplay: () => dispatch(getDisplay()),
        getAvatar: () => dispatch(getAvatar())
    };
}
const mapStateToProps = state => {
    return {
        display: state.display,
        status: state.status,
        avatar: state.avatar
    };
};

class Status extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.getStatus();
        this.props.getDisplay();
        this.props.getAvatar();
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.setStatus(document.getElementById("new-status").value);
        document.getElementById("new-status-form").reset()
    }

    render() {
        return (
            <div className="status-card" id="status">
                <MyCard display={this.props.display} status={this.props.status} avatar={this.props.avatar}/>
                <form id="new-status-form" className="status-update" onSubmit={this.handleSubmit}>
                    <input id="new-status" className="status-input" placeholder="update status" type="text" maxLength="40"/>
                    <button className="status-set" type="submit">set</button>
                </form>
            </div>
        )
    }
}

class MyCard extends React.Component {
    render() {
        const { display, status, avatar } = this.props;
        return (
            <div id="inner-card">
                <img src={avatar} alt="profile img" className="card_img"/>
                <div id="card_info">
                    <p id="card_name">{display}</p>
                    <p data-name='status'  id="card_status">{status}</p>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Status);