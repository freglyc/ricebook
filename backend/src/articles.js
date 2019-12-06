const models = require('./model.js');
const mongoose = require('mongoose');

const getArticles = async (req, res) => {
    const id = req.params.id;
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);

    let  articles = {};
    if (!id) {
        const following = await models.Profile.findOne({ username: req.body.username }).select('following -_id')
            .catch(err => res.status(500).send({ "result": "failed", "message": err }));
        articles = await models.Post.find({$or: following['following'].concat([req.body.username])
                .map(user => {return { author: user }})}).sort({'date': -1}).skip(skip).limit(limit)
            .catch(err => res.status(500).send({ "result": "failed", "message": err }))
    } else if (mongoose.Types.ObjectId.isValid(id)) {
        articles = await models.Post.find({_id: mongoose.Types.ObjectId(id)})
            .catch(err => res.status(500).send({ "result": "failed", "message": err }))
    } else {
        articles = await models.Post.find({author: id}).sort({'date': -1}).skip(skip).limit(limit)
            .catch(err => res.status(500).send({ "result": "failed", "message": err }));
    }
    return res.status(200).send({ "articles": articles });
};

const updateArticle = async (req, res) => {

    const id = req.params.id;
    const username = req.body.username;

    const article = await models.Post.findOne({_id: id})
        .catch(err => res.status(500).send({ "result": "failed", "message": err }));
    if (!article) return res.status(404).send({ "result": "failed", "message": "article does not exist" });

    const commentId = req.body['commentId'];
    if (commentId) {
        if (commentId === "-1") {
            // add comment
            article.comments.unshift({
                "author": username,
                "body": req.body['text'],
                "date": Date().toLocaleString()
            })
        } else {
            // update comment
            const comment = article.comments.filter(comment => comment._id.toString() === commentId);
            if (comment.length !== 1) { return res.status(404)
                .send({ "result": "failed", "message": "more than one comment with the same id" }); }
            if (comment[0].author !== username) { return res.status(401)
                .send({ "result": "failed", "message": "you do not own this comment" }); }
            comment[0].body = req.body['text']
        }
    } else {
        // update post body
        if (article.author !== username) { return res.status(401)
            .send({ "result": "failed", "message": "you do not own this post" }); }
        article['body'] = req.body['text']
    }
    await article.save().catch(err => res.status(500).send({ "result": "failed", "message": err }));
    const articles = await models.Post.find().catch(err => res.status(500).send({ "result": "failed", "message": err }));
    res.status(201).send({ "articles": articles });
};

const addArticle = async (req, res) => {
    const pic = req.fileurl === undefined ? '' : req.fileurl;
    const article = new models.Post({
        author: req.body.username,
        title: req.body.title,
        body: req.body.body,
        date: new Date().toLocaleString(),
        picture: pic,
        comments: []
    });
    await article.save().catch(err => res.status(500).send({ "result": "failed", "message": err }));
    const following = await models.Profile.findOne({ username: req.body.username }).select('following -_id')
        .catch(err => res.status(500).send({ "result": "failed", "message": err }));
    const articles = await models.Post.find({$or: following['following'].concat([req.body.username])
            .map(user => {return { author: user }})}).sort({'date': -1}).skip(0).limit(10)
        .catch(err => res.status(500).send({ "result": "failed", "message": err }));
    res.status(201).send({ "articles": articles });
};

module.exports = { getArticles, updateArticle, addArticle };