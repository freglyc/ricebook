// src/redux/actions/index.js

import * as s from './server';
import * as l from './local';
import {getCookie, setCookie} from "../../common/Cookies";

// Error responses
const errors = {
    "display": "Names must be contain only letters",
    "username": "Username name must begin with a letter and contain only numbers and letters",
    "zip": "Zip must follow standard zip format xxxxx or xxxxx-xxxx",
    "email": "Email address must follow standard email format xxx@xxx.xxx",
    "phone": "Phone number must follow standard phone format xxxxxxxxxx",
    "dob": "You must be 18 or older to register",
    "password": "Passwords must be 6 or more characters and match",
    "exists": "Account already exists, please try another"
};
// Required input patterns
const patterns = {
    "display": "[a-zA-Z\\-]+ [a-zA-Z\\-]+$",
    "username": "[a-zA-Z]+[a-zA-Z0-9]*$",
    "zip": "\\d{5}([\\-]\\d{4})?$",
    "email": "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$",
    "phone": "\\d{3}\\d{3}\\d{4}$",
    "dob": "^\\d{4}(\\-)(((0)[0-9])|((1)[0-2]))(\\-)([0-2][0-9]|(3)[0-1])$",
    "password": "[ -~]{6,}$"
};

export const loginPast = () => {
    return (dispatch) => {
        if (getCookie("loggedIn") !== "") {
            let username = getCookie("loggedIn");
            dispatch(l.setUsername(username));
            return true
        }
        return false
    }
};

export const login = (username, password) => {
    return (dispatch) => {
        return s.login(username, password).then(res => {
            if (res['result'] !== 'success') { return res['message'] }
            setCookie('loggedIn', res['username'], 7);
            dispatch(l.setUsername(res['username']));
            return ''
        })
    }
};

export const checkLogin = () => {
    return (dispatch) => {
        return s.loggedin().then(res => {
            if (res['result'] !== 'success') {
                setCookie('loggedIn', '', 0);
                dispatch(l.setUsername(''));
            }
            setCookie('loggedIn', res.username, 7);
            dispatch(l.setUsername(res.username));
        });
    }
};

export const register = (user) => {
    const getAge = (date) => {
        const today = new Date();
        const birth = new Date(date);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) { age--; }
        return age;
    };
    return async (dispatch) => {
        dispatch(l.localReset());
        for (let idx = 0; idx < Object.keys(patterns).length; idx++) {
            let k = Object.keys(patterns)[idx];
            if (!RegExp(patterns[k]).test(user[0][k])) { return errors[k] }
            if (k === "dob" && getAge(user[0]["dob"]) < 18) { return errors["dob"] }
            if (k === "password" && user[0]["password"] !== user[1]) { return errors["password"] }
        }
        let msg = 'Registration successful. Please login.';
        await s.register(user[0]).then((res) => {
            if (res['result'] === 'failed') msg = res['message'];
        });
        return msg
    }
};

export const logout = () => {
    return (dispatch) => {
        s.logout().finally();
        dispatch(l.localReset());
        setCookie('loggedIn', '', 0);
    }
};

// {"filter": "some string"}
export const search = (filter) => async (dispatch, getState) => {
    let pattern = RegExp(filter["filter"]);
    let newArticles = await Promise.all(getState().articles.map( async article => {
        await getOtherDisplay(article['author']).then(display => article['display'] = display);
        return article
    }));
    dispatch(l.setArticles(JSON.parse(JSON.stringify(newArticles))
        .filter(article => pattern.test(article['title']) || pattern.test(article['body']) || pattern.test(article['display']))))
};

export const postArticle = (article) => (dispatch) => s.addArticle(article).then(() => dispatch(getArticles()));

export const getArticles = () => (dispatch) => s.getArticles().then(res => dispatch(l.setArticles(res['articles'])));
export const getFollowing = () => (dispatch, getState) => s.getFollowing(getState().username).then(res => dispatch(l.setFollowing(res['following'])));
export const getDisplay = () => (dispatch, getState) => s.getDisplay(getState().username).then(res => dispatch(l.setDisplay(res['display'])));
export const getStatus = () => (dispatch, getState) => s.getStatus(getState().username).then(res => dispatch(l.setStatus(res['status'])));
export const getBirth = () => (dispatch, getState) => s.getBirth(getState().username).then(res => dispatch(l.setBirth(res['dob'])));
export const getEmail = () => (dispatch, getState) => s.getEmail(getState().username).then(res => dispatch(l.setEmail(res['email'])));
export const getPhone = () => (dispatch, getState) => s.getPhone(getState().username).then(res => dispatch(l.setPhone(res['phone'])));
export const getZip = () => (dispatch, getState) => s.getZip(getState().username).then(res => dispatch(l.setZip(res['zip'])));
export const getAvatar = () => (dispatch, getState) => s.getAvatar(getState().username).then(res => dispatch(l.setAvatar(res['avatar'])));

export const getOtherDisplay = (username) => s.getDisplay(username).then(res => res['display']);
export const getOtherStatus = (username) => s.getStatus(username).then(res => res['status']);
export const getOtherAvatar = (username) => s.getAvatar(username).then(res => res['avatar']);

export const setStatus = (status) => (dispatch) => s.setStatus(status).then(res => dispatch(l.setStatus(res['status'])));
export const setDisplay = (display) => (dispatch) => s.setDisplay(display).then(res => dispatch(l.setDisplay(res['display'])));
export const setEmail = (email) => (dispatch) => s.setEmail(email).then(res => dispatch(l.setEmail(res['email'])));
export const setPhone = (phone) => (dispatch) => s.setPhone(phone).then(res => dispatch(l.setPhone(res['phone'])));
export const setZip = (zip) => (dispatch) => s.setZip(zip).then(res => dispatch(l.setZip(res['zip'])));
export const setAvatar = (avatar) => (dispatch) => s.setAvatar(avatar).then(res => dispatch(l.setAvatar(res['avatar'])));

export const setPassword = (password) => s.setPassword(password);

// {name: ..., value: ..., confirm: ...}
export const editProfile = (info) => (dispatch) => {
    if (!RegExp(patterns[info["name"]]).test(info["value"])) {
        return errors[info["name"]]
    } else if (info["name"] === "password" && info["value"] !== info["confirm"]) {
        return errors["password"]
    } else {
        switch (info.name) {
            case 'display':
                dispatch(setDisplay(info.value));
                break;
            case 'email':
                dispatch(setEmail(info.value));
                break;
            case 'phone':
                dispatch(setPhone(info.value));
                break;
            case 'zip':
                dispatch(setZip(info.value));
                break;
            case 'avatar':
                dispatch(setAvatar(info.value));
                break;
            case 'password':
                setPassword(info.value);
                break;
            default:
                return ''
        }
        return ''
    }
};

export const follow = (username) => {
    return (dispatch) => {
        if (username === "") return '';
        s.getStatus(username).then(res => {if (res['message'] === "user does not exist") return "User does not exist" });
        return s.follow(username).then(res => {
            if (res['result'] === 'failed') { return res['message'] }
            else dispatch(l.setFollowing(res['following']));
            return ''
        });
    }
};
export const unfollow = (username) => {
    return (dispatch) => {
        s.getStatus(username).then(res => {if (res['message'] === "user does not exist") return "User does not exist" });
        return s.unfollow(username).then(res => {
            if (res['result'] === 'failed') { return res['message'] }
            dispatch(l.setFollowing(res['following']));
            return ''
        });
    }
};

export const updateArticle = (postId, update) => (dispatch) => s.updateArticle(postId, update).then(() => dispatch(getArticles()));


export const getAuth = () => s.getAuth();
