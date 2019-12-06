import React from 'react';
import { connect } from "react-redux";
import { register } from "../../redux/actions/index";
import '../../style.css';

function mapDispatchToProps(dispatch) {
    return {
        register: user => dispatch(register(user))
    };
}

class Register extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            first: "",
            last: "",
            reg_username: "",
            reg_email: "",
            phone: "",
            reg_zip: "",
            birthMonth: "January",
            birthDay: "01",
            birthYear: "2019",
            reg_password: "",
            confirm: "",
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
        const { first, last, reg_username, reg_email, phone, reg_zip, birthMonth, birthDay, birthYear, reg_password, confirm } = this.state;
        const monthMap = {"January": "01", "February": "02", "March": "03", "April": "04", "May": "05", "June": "06", "July": "07", "August": "08", "September": "09", "October": "10", "November": "11", "December": "12"};
        let user =
            {
                "username": reg_username, "display": first + " " + last, "email": reg_email,
                "phone": phone, "zip": reg_zip, "dob": birthYear + "-" + monthMap[birthMonth] + "-" + birthDay,
                "password": reg_password, "status": "Set a status", "followed": [],
                "avatar": "https://res.cloudinary.com/he3svaiw5/image/upload/v1575142785/placeholder_lszink.jpg"
            };
        this.props.register([user, confirm]).then(msg => {
            if (this._isMounted) { this.setState({ error: msg }) }
        });
    };

    getBirthDayArray() {
        const { birthMonth } = this.state;
        if (["January", "March", "May", "July", "August", "October", "December"].includes(birthMonth)) {
            return [...Array(31).keys()].map(x => x + 1).map(x => x < 10 ? "0" + x.toString() : x.toString())
        } else if (["April", "June", "September", "November"].includes(birthMonth)) {
            return [...Array(30).keys()].map(x => x + 1).map(x => x < 10 ? "0" + x.toString() : x.toString())
        } else {
            // February
            return [...Array(28).keys()].map(x => x + 1).map(x => x < 10 ? "0" + x.toString() : x.toString())
        }
    }

    static getBirthYearArray() {
        return [...Array(100).keys()].map(x => x + 1920).reverse()
    }

    render() {
        const { months, first, last, reg_username, reg_email, phone, reg_zip, birthMonth, birthDay, birthYear, reg_password, confirm, error } = this.state;
        return (
            <div id="register">
                <div>
                    <h1 id="signup-text">Sign up</h1>
                    <p id="register-tagline">It's quick and easy</p>
                </div>
                <form noValidate id="register-form" onSubmit={this.handleSubmit}>
                    <div>
                        <input name='first' id="first" className="signup-input register-1" type="text" placeholder="first name"
                               value={first} onChange={this.handleChange} required/>
                        <input name='last' id="last" className="signup-input register-2" type="text" placeholder="last name"
                               value={last} onChange={this.handleChange} required/>
                    </div>
                    <div>
                        <input name='username' id="reg_username" className="signup-input register-1" type="text" placeholder="username"
                               value={reg_username} onChange={this.handleChange} required/>
                        <input name='zip' id="reg_zip" className="signup-input" type="text" placeholder="zipcode"
                               value={reg_zip} onChange={this.handleChange} required/>
                    </div>
                    <div>
                        <input name='email' id="reg_email" className="signup-input register-1" type="text" placeholder="email"
                               value={reg_email} onChange={this.handleChange} required/>
                        <input name='phone' id="phone" className="signup-input register-2" type="text" placeholder="phone"
                               value={phone} onChange={this.handleChange} maxLength={10} required/>
                    </div>
                    <div id="register-birth">
                        <p id="register-birth-txt">birthday</p>
                        <div id="register-dropdowns">
                            <div className="register-dropdown">
                                <select required id="birthMonth" name="month" size="1" value={birthMonth} onChange={this.handleChange}>
                                    {months.map(el => (
                                        <option key={el} value={el}>{el}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="register-dropdown" id="register-birth-day">
                                <select required id="birthDay" name="day" size="1" value={birthDay} onChange={this.handleChange}>
                                    {this.getBirthDayArray().map(el => (
                                        <option key={el} value={el}>{el}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="register-dropdown">
                                <select required id="birthYear" name="year" size="1" value={birthYear} onChange={this.handleChange}>
                                    {Register.getBirthYearArray().map(el => (
                                        <option key={el} value={el}>{el}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div>
                        <input name='password' id="reg_password" className="signup-input register-1" type="password" placeholder="password" value={reg_password}
                               required onChange={this.handleChange} minLength={6}/>
                        <input name='confirm' id="confirm" className="signup-input register-2" type="password" placeholder="confirm" value={confirm}
                               onChange={this.handleChange} required/>
                    </div>
                    <div>
                        <input id="register-btn" type="submit" value="register"/>
                    </div>
                </form>
                <p id="register-error">{error}</p>
            </div>
        );
    }
}

export default connect(null, mapDispatchToProps)(Register);