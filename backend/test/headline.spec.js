const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();

chai.use(chaiHttp);

const auth = {
    'username': 'cdf7',
    'password': '123'
};

describe('Headline', () => {
    it('should get headline', (done) => {
        const agent = chai.request.agent(server);
        agent.post('/login')
            .send(auth)
            .then((err, res) => {
                agent.get('/headline')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('status');
                        done()
                    })
            })
    });

    it('should set headline', (done) => {
        const agent = chai.request.agent(server);
        const headline = {'status': 'new status'};
        agent.post('/login')
            .send(auth)
            .then((err, res) => {
                agent.put('/headline').send(headline)
                    .end((err, res) => {
                        res.should.have.status(201);
                        res.body.status.should.be.eq('new status');
                        done()
                    })
            })

    });
});
