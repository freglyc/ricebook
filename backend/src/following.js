const models = require('./model.js');

const getFollowing = async (req, res) => {
    const toFind = req.params.user ? req.params.user : req.body.username;
    const following = await models.Profile.findOne({ username: toFind }).select('following -_id')
        .catch(err => res.status(500).send({ "result": "failed", "message": err }));
    if (!following) return res.status(404).send({ "result": "failed", "message": "user does not exist" });
    following['username'] = toFind;
    res.status(200).send(following);
};

const follow = async (req, res) => {
    const toAdd = req.params.user;
    const toFollow = await models.Profile.findOne({ username: toAdd })
        .catch(err => res.status(500).send({ "result": "failed", "message": err }));
    if (!toFollow) return res.status(404).send({ "result": "failed", "message": "user does not exist" });
    const user = await models.Profile.findOne({ username: req.body.username })
        .catch(err => res.status(500).send({ "result": "failed", "message": err }));
    if (toAdd === req.body.username || user['following'].includes(toAdd)) return res.status(403)
        .send({ "result": "failed", "message": "cannot add yourself or someone you already follow" });
    user['following'].unshift(toAdd);
    await user.save().catch(err => res.status(500)
        .send({ "result": "failed", "message": err }));
    res.status(201).send({ 'username': req.body.username, 'following': user['following'] })
};

const unfollow = async (req, res) => {
    const toRemove = req.params.user;
    const toUnfollow = await models.Profile.findOne({ username: toRemove })
        .catch(err => res.status(500).send({ "result": "failed", "message": err }));
    if (!toUnfollow) return res.status(404).send({ "result": "failed", "message": "user does not exist" });
    const user = await models.Profile.findOne({ username: req.body.username })
        .catch(err => res.status(500).send({ "result": "failed", "message": err }));
    const idx = user['following'].indexOf(toRemove);
    if (idx < 0) return res.status(403)
        .send({ "result": "failed", "message": "you aren't following this user"});
    user['following'].splice(idx, 1);
    await user.save().catch(err => res.status(500)
        .send({ "result": "failed", "message": err }));
    res.status(201).send({ 'username': req.body.username, 'following': user['following'] });
};

module.exports = { getFollowing, follow, unfollow };