const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();

chai.use(chaiHttp);

const auth = {
    'username': 'cdf7',
    'password': '123'
};

describe('Articles', () => {
    it('should get a list of articles', (done) => {
        const agent = chai.request.agent(server);
        agent.post('/login')
            .send(auth)
            .then((err, res) => {
                agent.get('/articles')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('articles');
                        done()
                    })
            })
    });

    it('should get a specific article', (done) => {
        const agent = chai.request.agent(server);
        agent.post('/login')
            .send(auth)
            .then((err, res) => {
                agent.get('/articles/5dc496e90ee52ac97019a847')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('articles');
                        done()
                    })
            })
    });

    it('should create an article', (done) => {
        const agent = chai.request.agent(server);
        const article =
            {
                "author": "cdf7",
                "title": "new title",
                "body": "this is a new test",
                "date": "2019-11-01",
                "picture": "",
                "comments": [
                    {
                        "author": "cdf7",
                        "body": "this is a comment",
                        "date": "2019-11-01"
                    }
                ]
            };
        agent.post('/login')
            .send(auth)
            .then((err, res) => {
                agent.post('/article').send(article)
                    .end((err, res) => {
                        res.should.have.status(201);
                        res.body.should.have.property('articles');
                        done()
                    })
            })
    });
});
