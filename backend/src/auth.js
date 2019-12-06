const models = require('./model.js');
const bcrypt = require('bcrypt');
const redis = require('redis').createClient(process.env.REDIS_URL);

const secretMessage = process.env.SECRET_MESSAGE;
const pepper = process.env.PEPPER;

const getHash = async (password, salt) => {
    return await bcrypt.hash(salt + password + pepper, 11);
};

const compare = async(password, salt, hash) => {
    return await bcrypt.compare(salt + password + pepper, hash);
};

const parseCookies = (str) => {
    return str.split('; ').map(cookie => cookie.split("="))
        .reduce((total, current) => {
            total[current[0]] = decodeURIComponent(current[1]);
            return total;
            }, {});
};

const login = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // look for user in db
    const users = await models.User.find({ username: username })
        .catch(err => res.status(500).send({ "result": "failed", "message": err }));
    if (users.length === 0) { return res.status(404).send({ "result": "failed", "message": "user does not exist" }); }
    const userObj = users[0];

    // check that password was correct through hash
    if (!await compare(password, userObj.salt, userObj.hash)) return res.status(403)
        .send({ "result": "failed", "message": "invalid password" });

    // create a session key and send back to client
    const sessionKey = await bcrypt.hash(secretMessage + new Date().getTime() + userObj.username, 3);

    redis.hmset('sessions', sessionKey, JSON.stringify(userObj));

    return res.cookie('session', sessionKey, { maxAge: 3600*1000, httpOnly: true}).status(200)
        .send({ "username": username, "result": "success" });
};

const isLoggedIn = (req, res, next) => {

    if (req.isAuthenticated()) {
        req.body.username = req.user.username;
        return next()
    }

    if(!req.headers.cookie) return res.status(401).send({ "result": "failed", "message": "unauthorized" });
    const cookies = parseCookies(req.headers.cookie);
    const sessionKey = cookies['session'];

    redis.hget('sessions', sessionKey, (err, user) => {

        if (err) return res.status(401).send({ "result": "failed", "message": "unauthorized" });

        const userObj = JSON.parse(user);

        // unauthorized if session id does not exist
        if (userObj === null) return res.status(401).send({ "result": "failed", "message": "unauthorized" });

        // add username to req body
        req.body.username = userObj.username;
        return next();
    });
};

const logout = (req, res) => {

    if (req.isAuthenticated()) {
        req.session.destroy();
        return res.status(200).send('OK');
    }

    const cookies = parseCookies(req.headers.cookie);
    const sessionKey = cookies['session'];
    // remove saved session
    redis.hdel('sessions', sessionKey);

    // remove session from cookie
    return res.cookie('session', "", { maxAge: 0, httpOnly: true }).status(200).send('OK');
};

const register = async (req, res) => {

    // ensure unique username
    const users = await models.User.find({ username: req.body.username }, (err, users) => {
        if (err) return res.status(500).send({ "result": "failed", "message": err });
    });
    if (users.length !== 0) return res.status(403).send({ "result": "failed", "message": "username already in use" });

    // registration
    const salt = await bcrypt.hash(req.body.username + new Date().getTime(), 13);
    const hash = await getHash(req.body.password, salt);
    const user = new models.User({
        username: req.body.username, salt: salt, hash: hash,
        auth: {'rice': req.body.username}
    });
    const profileData = req.body;
    delete profileData['password']; // Don't want to save the password in plain text...
    const profile = new models.Profile(req.body);

    // save to db
    await user.save((err, user) => {
        if (err) return res.status(500).send({ "result": "failed", "message": err });
    });
    await profile.save((err, profile) => {
        if (err) return res.status(500).send({ "result": "failed", "message": err });
    });

    return res.status(200).send({ "username": req.body.username, "result": "success" });
};

const updatePassword = async (req, res) => {
    const user = await models.User.findOne({ username: req.body.username })
        .catch(err => res.status(500).send({ "result": "failed", "message": err }));
    user['hash'] = await getHash(req.body.password, user['salt']);
    await user.save().catch(err => res.status(500).send({ "result": "failed", "message": err }));
    res.status(201).send({ "username": req.body.username, "result": "success" });
};

module.exports = { compare, login, isLoggedIn, logout, register, updatePassword };