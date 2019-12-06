const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();

chai.use(chaiHttp);

const auth = {
    'username': 'cdf7',
    'password': '123'
};

describe('Authentication', () => {
    it('should login', (done) => {
        chai.request(server)
            .post('/login')
            .send(auth)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.result.should.eq('success');
                done();
            });
    });

    it('should logout', (done) => {
        const agent = chai.request.agent(server);
        agent.post('/login')
            .send(auth).then( (err, res) => {
                agent.put('/logout')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.text.should.eq('OK');
                        done();
                    });
            });
    });
});
