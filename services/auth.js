const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const axios = require('axios').default;

module.exports = class Auth {

    privateKey = 'jwt_pk';

    getPemKey() {
        return new Promise((resolve, reject) => {
            fs.readFile(path.resolve('services/key.pem'), (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data.toString());
            });
        });
    }

    jwt(username, password) {
        return jwt.sign({ username, password }, this.privateKey);
    }

    login(username, password) {
        if (!username || !password) return null;
        username = username.toLowerCase();
        if (username.toLowerCase() == 'phongdo' && password == '12345678') {
            return {
                token: this.jwt(username, password)
            }
        }
        return null;
    }

    loginCallback(username, password, callback) {
        if (!username || !password) {
            callback(null);
            return;
        }
        username = username.toLowerCase();
        if (username.toLowerCase() == 'phongdo' && password == '12345678') {
            callback({
                username, password
            });
            return;
        }
        callback(null);
    }

    loginPromise(username, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!username || !password) {
                    reject({
                        message: 'Username and Password are required.'
                    });
                    return;
                }
                username = username.toLowerCase();
                if (username.toLowerCase() == 'phongdo' && password == '12345678') {
                    resolve({
                        token: this.jwt(username, password)
                    })
                    return;
                }
                reject({
                    message: 'Username or Password not match.'
                });
            }, 1000);
        });
    }

    saveUser(username, password) {
        // save username and password into DB
        //return _id, username, password
        return Promise.resolve({
            _id: 1,
            username,
            password
        });
    }

    signUp(username, password) {
        return new Promise((resolve, reject) => {
            if (!username || !password) {
                reject({
                    message: 'Username and Password are required.'
                });
                return;
            }
            username = username.toLowerCase();
            this.saveUser(username, password).then(authData => {
                resolve(authData);
            }).catch(err => {
                reject(Promise.reject(err));
            })
        });
    }

    getUserInfo() {
        return axios.get('https://abc.com/user/1').then(res => {
            return res.data;
        });
    }

}
