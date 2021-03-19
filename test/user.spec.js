const expect = require('chai').expect;
const request = require('supertest');

const app = require('../app.js');
const conn = require('../db/index.js');
process.env.NODE_ENV = 'test';

describe('Test User API', function () {
    describe('POST /users/login', function () {
        this.timeout(5000);
        before((done) => {
            conn.connect()
                .then(() => done())
                .catch((err) => done(err));
        })

        after((done) => {
            conn.close()
                .then(() => done())
                .catch((err) => done(err));
        })

        it('Login success', (done) => {
            request(app).post('/users/login')
                .send({
                    username: 'phongdo',
                    password: '12345678'
                })
                .then((res) => {
                    expect(res.body).to.deep.equal({
                        username: 'phongdo',
                        password: '12345678'
                    });
                    done();
                })
                .catch((err) => done(err));
        });

        it('SignUp success', (done) => {
            request(app).post('/users/signup')
                .send({
                    username: 'phongdo',
                    password: '12345678',
                    firstName: 'phong',
                    lastName: 'do'
                })
                .then((res) => {
                    done();
                })
                .catch((err) => done(err));
        });

        it('GetUserInfo success', (done) => {
            request(app).post('/users/signup')
                .send({
                    username: 'phongdo',
                    password: '12345678',
                    firstName: 'phong',
                    lastName: 'do'
                })
                .then((res) => {
                    request(app).get('/users/info')
                        .query({
                            username: 'phongdo'
                        })
                        .then((res) => {
                            expect(res.body.username).to.equal('phongdo');
                            done();
                        })
                        .catch((err) => done(err));
                })
                .catch((err) => done(err));
        });
    });
});