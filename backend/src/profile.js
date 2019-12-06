const models = require('./model.js');

const getEmail = async (req, res) => {
    const toFind = req.params.user ? req.params.user : req.body.username;
    const email = await models.Profile.findOne({ username: toFind }).select('email -_id')
        .catch(err => res.status(500).send({ "result": "failed", "message": err }));
    if (!email) return res.status(404).send({ "result": "failed", "message": "user does not exist" });
    email['username'] = toFind;
    res.status(200).send(email);
};

const updateEmail = async (req, res) => {
    const user = await models.Profile.findOne({ username: req.body.username })
        .catch(err => res.status(500).send({ "result": "failed", "message": err }));
    user['email'] = req.body.email;
    await user.save().catch(err => res.status(500).send({ "result": "failed", "message": err }));
    res.status(201).send({ "username": req.body.username, "email": req.body.email });
};

const getZip = async (req, res) => {
    const toFind = req.params.user ? req.params.user : req.body.username;
    const zip = await models.Profile.findOne({ username: toFind }).select('zip -_id')
        .catch(err => res.status(500).send({ "result": "failed", "message": err }));
    if (!zip) return res.status(404).send({ "result": "failed", "message": "user does not exist" });
    zip['username'] = toFind;
    res.status(200).send(zip);
};

const updateZip = async (req, res) => {
    const user = await models.Profile.findOne({ username: req.body.username })
        .catch(err => res.status(500).send({ "result": "failed", "message": err }));
    user['zip'] = req.body.zip;
    await user.save().catch(err => res.status(500).send({ "result": "failed", "message": err }));
    res.status(201).send({ "username": req.body.username, "zip": req.body.zip });
};

const getBirth = async (req, res) => {
    const toFind = req.params.user ? req.params.user : req.body.username;
    const birth = await models.Profile.findOne({ username: toFind }).select('dob -_id')
        .catch(err => res.status(500).send({ "result": "failed", "message": err }));
    if (!birth) return res.status(404).send({ "result": "failed", "message": "user does not exist" });
    birth['username'] = toFind;
    res.status(200).send(birth);
};

const getAvatar = async (req, res) => {
    const toFind = req.params.user ? req.params.user : req.body.username;
    const avatar = await models.Profile.findOne({ username: toFind }).select('avatar -_id')
        .catch(err => res.status(500).send({ "result": "failed", "message": err }));
    if (!avatar) return res.status(404).send({ "result": "failed", "message": "user does not exist" });
    avatar['username'] = toFind;
    res.status(200).send(avatar);
};

const updateAvatar = async (req, res) => {
    let url = req.fileurl.split('upload/');
    url = url[0] + 'upload/w_1000,ar_1:1,c_fill,g_auto/' + url[1];
    const user = await models.Profile.findOne({ username: req.body.username })
        .catch(err => res.status(500).send({ "result": "failed", "message": err }));
    user['avatar'] = url;
    await user.save().catch(err => res.status(500).send({ "result": "failed", "message": err }));

    res.status(201).send({ "username": req.body.username, "avatar": url })
};

const getDisplay = async (req, res) => {
    const toFind = req.params.user ? req.params.user : req.body.username;
    const display = await models.Profile.findOne({ username: toFind }).select('display -_id')
        .catch(err => res.status(500).send({ "result": "failed", "message": err }));
    if (!display) return res.status(404).send({ "result": "failed", "message": "user does not exist" });
    display['username'] = toFind;
    res.status(200).send(display);
};

const updateDisplay = async (req, res) => {
    const user = await models.Profile.findOne({ username: req.body.username })
        .catch(err => res.status(500).send({ "result": "failed", "message": err }));
    user['display'] = req.body.display;
    await user.save().catch(err => res.status(500).send({ "result": "failed", "message": err }));
    res.status(201).send({ "username": req.body.username, "display": req.body.display });
};

const getPhone = async (req, res) => {
    const toFind = req.params.user ? req.params.user : req.body.username;
    const phone = await models.Profile.findOne({ username: toFind }).select('phone -_id')
        .catch(err => res.status(500).send({ "result": "failed", "message": err }));
    if (!phone) return res.status(404).send({ "result": "failed", "message": "user does not exist" });
    phone['username'] = toFind;
    res.status(200).send(phone);
};

const updatePhone = async (req, res) => {
    const user = await models.Profile.findOne({ username: req.body.username })
        .catch(err => res.status(500).send({ "result": "failed", "message": err }));
    user['phone'] = req.body.phone;
    await user.save().catch(err => res.status(500).send({ "result": "failed", "message": err }));
    res.status(201).send({ "username": req.body.username, "phone": req.body.phone });
};

module.exports = {
    getEmail, updateEmail, getZip, updateZip, getBirth, getDisplay,
    updateDisplay, getPhone, updatePhone, getAvatar, updateAvatar
};