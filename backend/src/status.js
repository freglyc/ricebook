const models = require('./model.js');

const getStatus = async (req, res) => {
    const toFind = req.params.user ? req.params.user : req.body.username;
    const status = await models.Profile.findOne({ username: toFind }).select('status -_id')
        .catch(err => res.status(500).send({ "result": "failed", "message": err }));
    if (!status) return res.status(404).send({ "result": "failed", "message": "user does not exist" });
    status['username'] = toFind;
    res.status(200).send(status);
};

const updateStatus = async (req, res) => {
    const user = await models.Profile.findOne({ username: req.body.username })
        .catch(err => res.status(500).send({ "result": "failed", "message": err }));
    user['status'] = req.body.status;
    await user.save().catch(err => res.status(500).send({ "result": "failed", "message": err }));
    res.status(201).send({ "username": req.body.username, "status": req.body.status });
};

module.exports = { getStatus, updateStatus };