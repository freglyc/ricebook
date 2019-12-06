import React from 'react';
import {connect} from "react-redux";
import Navbar from "../../common/Navbar";
import {
    getDisplay,
    getBirth,
    getEmail,
    getPhone,
    getZip,
    editProfile,
    setDisplay,
    setAvatar, getAvatar,
    getAuth
} from "../../redux/actions";
import '../../style.css';

const mapStateToProps = state => {
    return {
        username: state.username,
        display: state.display,
        birth: state.birth,
        email: state.email,
        phone: state.phone,
        zip: state.zip,
        avatar: state.avatar
    };
};

function mapDispatchToProps(dispatch) {
    return {
        editProfile: info => dispatch(editProfile(info)),
        setAvatar: (avatar) => dispatch(setAvatar(avatar)),
        setDisplay: (display) => dispatch(setDisplay(display)),
        getDisplay: () => dispatch(getDisplay()),
        getBirth: () => dispatch(getBirth()),
        getEmail: () => dispatch(getEmail()),
        getPhone: () => dispatch(getPhone()),
        getZip: () => dispatch(getZip()),
        getAvatar: () => dispatch(getAvatar())
    };
}

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            toggles: {"username": true, "display": true, "birth": true, "email": true, "phone": true, "zip": true, "password": true },
            error: "",
            refresh: true,
            confirmHidden: true,
            link: '',
            auth: {}
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.link = this.link.bind(this);
    }

    async componentDidMount() {
        this.props.getDisplay();
        this.props.getBirth();
        this.props.getEmail();
        this.props.getPhone();
        this.props.getZip();
        this.props.getAvatar();

        document.getElementById('profile-img').style.background = 'url(\'' + this.props.avatar + '\') no-repeat';
        document.getElementById('profile-img').style.backgroundSize = 'contain';

        await getAuth().then(auth => this.setState({ auth: auth['auth'] }));
        if (Object.keys(this.state.auth).length === 2) {
            if (this.props.username === this.state.auth['rice']) this.setState({link: 'unlink facebook'});
            else this.setState({link: 'unlink ricebook'});
        } else if (this.state.auth.hasOwnProperty('rice')) {
            this.setState({link: 'link facebook'});
        } else if (this.state.auth.hasOwnProperty('facebook')) {
            this.setState({link: 'link rice'});
        } else {
            this.setState({link: 'error'});
        }
    }


    handleClick(event) {
        event.preventDefault();
        let name = event.target.name;
        let toggles = this.state.toggles;
        // if readonly, make editable
        if (toggles[name]) {
            if (name === "password") {
                this.setState({ confirmHidden: false });
                document.getElementById("password-value").value = "";
                document.getElementById("confirm-value").value = "";
            }
            toggles[name] = !toggles[name];
            this.setState({toggles: toggles});
        } else {
            // if editable check validity of value and update
            let val = document.getElementById(name + "-value").value;
            let info = {"name": name, "value": val};
            let confirm = document.getElementById("confirm-value").value;
            if (name === "password"){ info["confirm"] = confirm }
            let result = this.props.editProfile(info);
            // let result = "";
            if (result === "") {
                toggles[name] = !toggles[name];
                this.setState({ confirmHidden: true, refresh: !this.state.refresh });
            }
            this.setState({ error: result});
        }
    }

    handleImageChange(event) {
        const file = event.target.files[0];
        if (file.type === 'image/jpeg') {
            this.props.setAvatar(file);
        }
    }

    render() {
        return (
            <div>
                <Navbar/>
                <div id="profile">
                    <div id="profile-box">
                        <div>
                            <span id="img-upload">
                                <label htmlFor="change-profile">
                                    <div id="profile-img" />
                                </label>
                                <input id="change-profile" type="file" accept="image/*" onChange={this.handleImageChange}/>
                            </span>
                        </div>
                        <table id="profile-table">
                            <tbody>
                            <tr>
                                <th>Username</th>
                                <td className="profile-table-center"><input id="username-value" readOnly={this.state.toggles["username"]} defaultValue={this.props.username}/></td>
                            </tr>
                            <tr>
                                <th>Display</th>
                                <td className="profile-table-center"><input id="display-value" readOnly={this.state.toggles["display"]} defaultValue={this.props.display}/></td>
                                <td><input name="display" className="profile-edit-btn" type="button" value={this.state.toggles["display"] === true ? "edit" : "set"} onClick={this.handleClick}/></td>
                            </tr>
                            <tr>
                                <th>Birthday</th>
                                <td className="profile-table-center"><input id="birth-value" readOnly={this.state.toggles["birth"]} defaultValue={this.props.birth}/></td>
                            </tr>
                            <tr>
                                <th>Email</th>
                                <td className="profile-table-center"><input id="email-value" readOnly={this.state.toggles["email"]} defaultValue={this.props.email}/></td>
                                <td><input name="email" className="profile-edit-btn" type="button" value={this.state.toggles["email"] === true ? "edit" : "set"} onClick={this.handleClick}/></td>
                            </tr>
                            <tr>
                                <th>Phone</th>
                                <td className="profile-table-center"><input id="phone-value" readOnly={this.state.toggles["phone"]} defaultValue={this.props.phone}/></td>
                                <td><input name="phone" className="profile-edit-btn" type="button" value={this.state.toggles["phone"] === true ? "edit" : "set"} onClick={this.handleClick}/></td>
                            </tr>
                            <tr>
                                <th>Zipcode</th>
                                <td className="profile-table-center"><input id="zip-value" readOnly={this.state.toggles["zip"]} defaultValue={this.props.zip}/></td>
                                <td><input name="zip" className="profile-edit-btn" type="button" value={this.state.toggles["zip"] === true ? "edit" : "set"} onClick={this.handleClick}/></td>
                            </tr>
                            <tr key={this.state.refresh}>
                                <th>Password</th>
                                <td className="profile-table-center"><input id="password-value" readOnly={this.state.toggles["password"]} defaultValue={"*".repeat(10)} /></td>
                                <td><input name="password" className="profile-edit-btn" type="button" value={this.state.toggles["password"] === true ? "edit" : "set"} onClick={this.handleClick}/></td>
                            </tr>
                            <tr hidden={this.state.confirmHidden}>
                                <th>Confirm</th>
                                <td className="profile-table-center"><input id="confirm-value"/></td>
                            </tr>
                            </tbody>
                        </table>
                        <p>{this.state.error}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
