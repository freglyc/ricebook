// ROUTES
module.exports = function(app) {
    const auth = require('./auth');
    const articles = require('./articles');
    const following = require('./following');
    const status = require('./status');
    const profile = require('./profile');
    const cloudinary = require('./uploadCloudinary');


    const session = require('express-session');
    const pass = require('passport');
    const FacebookStrategy = require('passport-facebook');
    const models = require('./model.js');
    const randomstring = require('randomstring');

    pass.serializeUser(function(user, done) {
        done(null, user);
    });

    pass.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    pass.use('fb-signin', new FacebookStrategy({
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: process.env.FRONTEND_URL + "/auth/facebook/callback",
            passReqToCallback: true
        },
        async function(req, accessToken, refreshToken, profile, cb) {
            const user = await models.User.findOne({ facebook: profile.id });
            if (user) {
                return cb(null, user);
            } else {
                const username = randomstring.generate(10);
                const newUser = new models.User({
                    username: username,
                    auth: {'facebook': username},
                    facebook: profile.id
                });
                const newProfile = new models.Profile({
                    username: username,
                    display: profile.displayName,
                    status: 'set status',
                    following: [],
                    dob: '',
                    zip: '',
                    avatar: process.env.PLACEHOLDER_AVATAR,
                    phone: '',
                    email: '',
                });
                // save to db
                await newUser.save((err, user) => {if (err) cb(err)});
                await newProfile.save((err, profile) => {if (err) cb(err)});

                return cb(null, newUser);
            }
    }));

    app.use(session({secret: 'cats'}));
    app.use(pass.initialize());
    app.use(pass.session());

    app.get('/', (req, res) => res.status(200).send('ricebook backend'));

    app.post('/login', auth.login);
    app.put('/logout', auth.isLoggedIn, auth.logout);
    app.post('/register', auth.register);

    app.get('/auth/facebook', (req, res, next) => {req.session.destroy(); next();}, pass.authenticate('fb-signin'));
    app.get('/auth/facebook/callback', pass.authenticate('fb-signin', {
        successRedirect: process.env.FRONTEND_URL,
        failureRedirect: process.env.FRONTEND_URL }));

    app.get('/loggedin', auth.isLoggedIn, (req, res) => res.send({ result: 'success', username: req.body.username }));

    app.get('/articles/:id?/:author?', auth.isLoggedIn, articles.getArticles);
    app.put('/articles/:id', auth.isLoggedIn, articles.updateArticle);
    app.post('/article', cloudinary.parseImage, auth.isLoggedIn, cloudinary.upload('articles'), auth.isLoggedIn, articles.addArticle);

    app.get('/headline/:user?', auth.isLoggedIn, status.getStatus);
    app.put('/headline', auth.isLoggedIn, status.updateStatus);

    app.get('/following/:user?', auth.isLoggedIn, following.getFollowing);
    app.put('/following/:user', auth.isLoggedIn, following.follow);
    app.delete('/following/:user', auth.isLoggedIn, following.unfollow);

    app.get('/email/:user?', auth.isLoggedIn, profile.getEmail);
    app.put('/email', auth.isLoggedIn, profile.updateEmail);
    app.get('/zip/:user?', auth.isLoggedIn, profile.getZip);
    app.put('/zip', auth.isLoggedIn, profile.updateZip);
    app.get('/dob/:user?', auth.isLoggedIn, profile.getBirth);

    app.get('/avatar/:user?', auth.isLoggedIn, profile.getAvatar);
    app.put('/avatar', cloudinary.parseImage, auth.isLoggedIn, cloudinary.upload('avatars'), profile.updateAvatar);

    app.get('/display/:user?', auth.isLoggedIn, profile.getDisplay);
    app.put('/display', auth.isLoggedIn, profile.updateDisplay);
    app.get('/phone/:user?', auth.isLoggedIn, profile.getPhone);
    app.put('/phone', auth.isLoggedIn, profile.updatePhone);
    app.put('/password', auth.isLoggedIn, auth.updatePassword);

    app.get('/auth', auth.isLoggedIn, async (req, res) => {
        const user = await models.User.findOne({username: req.body.username});
        res.status(200).send({ 'auth': user.auth });
    });
};