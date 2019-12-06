// MongoDB Models

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    salt: String,
    hash: String,
    facebook: String,
    auth: {}
});

const profileSchema = new mongoose.Schema({
    username: String,
    display: String,
    status: String,
    following: [String],
    dob: String,
    zip: String,
    avatar: String,
    phone: String,
    email: String,
});

const postSchema = new mongoose.Schema({
    author: String,
    title: String,
    body: String,
    date: Date,
    picture: String,
    comments: [{
        author: String,
        body: String,
        date: Date
    }]
});

exports.User = mongoose.model('users', userSchema, 'users');
exports.Profile = mongoose.model('profiles', profileSchema, 'profiles');
exports.Post = mongoose.model('posts', postSchema, 'posts');