const expect = require("chai").expect;
const sinon = require('sinon');
const Auth = require("../services/auth");
const axios = require('axios').default;
const fs = require('fs');
const nock = require('nock');
var auth = new Auth();

describe.skip("Auth Service", () => {
    describe.skip("Login Function", () => {
        it("Login with username is null", () => {
            const result = auth.login(null, '12345678');
            expect(result).to.be.null;
        });
        it("Login with password is null", () => {
            const result = auth.login('phongdo', null);
            expect(result).to.be.null;
        });
        it("Login with username is correct and password is incorrect", () => {
            const result = auth.login('phongdo', '1234567');
            expect(result).to.be.null;
        });
        it("Login with username is correct and password is correct", () => {
            const result = auth.login('phongdo', '12345678');
            expect(result.token).to.be.not.null;
        });
        it("Login with username is correct and username contains UPPERCASE character", () => {
            const result = auth.login('phOngDo', '12345678');
            expect(result.token).to.be.not.null;
        });
        it("spy jwt method", () => {
            let spy = sinon.spy(auth, 'jwt');
            let username = 'phOngDo', password = '12345678';
            const result = auth.login(username, password);
            expect(result.token).to.be.not.null;
            expect(spy.calledOnce).to.be.true;
            expect(spy.calledWith(username.toLowerCase(), password)).to.be.true;
        });
    });

    describe.skip('LoginPromise function', () => {
        it("Login with username is null", (done) => {
            auth.loginPromise(null, '12345678')
                .then((authData) => {
                    done(new Error('test case error'));
                })
                .catch((err) => {
                    expect(err.message).to.be.not.null;
                    done();
                });
        });
        it("Login with username is correct and password is incorrect", () => {
            const result = auth.login('phongdo', '1234567');
            auth.loginPromise('phongdo', '1234567')
                .then((authData) => {
                    done(new Error('test case error'));
                })
                .catch((err) => {
                    expect(err.message).to.be.not.null;
                    done();
                });
        });
        it("Login with username is correct and username contains UPPERCASE character", () => {
            auth.loginPromise('phOngDo', '12345678')
                .then((authData) => {
                    expect(authData.token).to.be.not.null;
                    done();
                })
                .catch((err) => {
                    done(new Error('test case error'));
                });
        });
    });

    describe.skip('SignUp function', () => {
        var stub;

        beforeEach(() => {
            stub = sinon.stub(auth, 'saveUser');
        });

        afterEach(() => {
            stub.restore();
        });

        it('sign up with correct username and password', (done) => {
            let username = 'phongdo', password = '12345678';
            stub.withArgs(username, password).returns(Promise.resolve({
                _id: 2,
                username,
                password
            }));
            auth.signUp(username, password).then(authData => {
                expect(authData._id).equal(2);
                done();
            }).catch(err => {
                done(err);
            })
        });
    });

    describe.skip('Test LoginCallback', () => {
        it('login with correct username and correct password', () => {
            let callback = sinon.spy();
            let username = 'phOngDo', password = '12345678';
            auth.loginCallback(username, password, callback);
            expect(callback.calledOnce).to.be.true;
            expect(callback.calledWith({
                username: username.toLowerCase(),
                password
            }
            )).to.be.true;
        });
    });

    describe.skip('Fake FS', () => {
        let fake;
        after(() => {
            sinon.restore();
        })
        it('GetPemKey function 1', (done) => {
            fake = sinon.fake.yields(null, 'this is key.pem content');
            sinon.replace(fs, 'readFile', fake);
            auth.getPemKey().then(data => {
                expect(data).equal('this is key.pem content');
                done();
            }).catch(err => {
                console.log(err);
                done();
            })
        });
        it('GetPemKey function 2', (done) => {
            auth.getPemKey().then(data => {
                expect(data).equal('this is key.pem content');
                done();
            }).catch(err => {
                done(err);
            });
        })
    });

    describe('GetUserInfo function', () => {
        it('fetch user info', (done) => {
            const scope = nock('https://abc.com')
                .get('/user/1')
                .reply(200, {
                    firstName: 'phong',
                    lastName: 'do'
                });
            auth.getUserInfo().then(user => {
                expect(user).to.deep.equal({
                    firstName: 'phong',
                    lastName: 'do'
                });
                done();
            }).catch(err => {
                done(err);
            })
        });
    });
});