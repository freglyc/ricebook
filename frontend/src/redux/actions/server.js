
import axios from 'axios';
axios.defaults.withCredentials = true;

const baseURL = 'https://backend-ricebook.herokuapp.com';

// SERVER GET ACTIONS
export const getDisplay = (username = '') => axios.get(baseURL + '/display/' + username).then(data => data['data'], error => error.response['data']);

export const getStatus = (username = '') => axios.get(baseURL + '/headline/' + username).then(data => data['data'], error => error.response['data']);

export const getArticles = (info = '') => axios.get(baseURL + '/articles/' + info, { params: { limit: 10, skip: 0 } }).then(data => data['data'], error => error.response['data']);

export const getFollowing = (username = '') => axios.get(baseURL + '/following/' + username).then(data => data['data'], error => error.response['data']);

export const getEmail = (username = '') => axios.get(baseURL + '/email/' + username).then(data => data['data'], error => error.response['data']);

export const getPhone = (username = '') => axios.get(baseURL + '/phone/' + username).then(data => data['data'], error => error.response['data']);

export const getBirth = (username = '') => axios.get(baseURL + '/dob/' + username).then(data => data['data'], error => error.response['data']);

export const getZip = (username = '') => axios.get(baseURL + '/zip/' + username).then(data => data['data'], error => error.response['data']);

export const getAvatar = (username = '') => axios.get(baseURL + '/avatar/' + username).then(data => data['data'], error => error.response['data']);

// SERVER SET ACTIONS
export const login = (username, password) => axios.post(baseURL + '/login', {'username': username, 'password': password}).then(data => data['data'], error => error.response['data']);

export const register = (user) => axios.post(baseURL + '/register', user).then(data => data['data'], error => error.response['data']);

export const logout = () => axios.put(baseURL + '/logout');

export const setDisplay = (display) => axios.put(baseURL + '/display', { 'display': display }).then(data => data['data'], error => error.response['data']);

export const setStatus = (status) => axios.put(baseURL + '/headline', { 'status': status }).then(data => data['data'], error => error.response['data']);

export const addArticle = (article) => axios.post(baseURL + '/article', article, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(data => data['data'], error => error.response['data']);

export const updateArticle = (postId, update) => axios.put(baseURL + '/articles/' + postId, update).then(data => data['data'], error => error.response['data']);

export const follow = (username) => axios.put(baseURL + '/following/' + username).then(data => data['data'], error => error.response['data']);

export const unfollow = (username) => axios.delete(baseURL + '/following/' + username).then(data => data['data'], error => error.response['data']);

export const setEmail = (email) => axios.put(baseURL + '/email', { 'email': email }).then(data => data['data'], error => error.response['data']);

export const setPhone = (phone) => axios.put(baseURL + '/phone', { 'phone': phone }).then(data => data['data'], error => error.response['data']);

export const setZip = (zip) => axios.put(baseURL + '/zip', { 'zip': zip }).then(data => data['data'], error => error.response['data']);

export const setAvatar = (avatar) => {
    let bodyFormData = new FormData();
    bodyFormData.append('image', avatar);
    return axios.put(baseURL + '/avatar', bodyFormData).then(data => data['data'], error => error.response['data'])
};

export const setPassword = (password) => axios.put(baseURL + '/password', { 'password': password }).then(data => data['data'], error => error.response['data']);

export const loggedin = () => axios.get(baseURL + '/loggedin').then(data => data['data']);

export const getAuth = () => axios.get(baseURL + '/auth').then(data => data['data']);

