var express = require('express');
var router = express.Router();
const User = require('../db/models/user').User;

/* GET users listing. */
router.post('/login', function (req, res, next) {
  res.json({
    username: req.body.username,
    password: req.body.password
  });
});

router.post('/signup', function (req, res, next) {
  const userData = {
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password
  }
  const user = new User(userData);
  user.save(user)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json(err));
});

router.get('/info', function (req, res, next) {
  User.find({
    username: req.query.username
  }).then(user => {
    if (user && user.length == 1) {
      res.json(user[0]);
    } else {
      res.status(400).json({
        message: 'user not found'
      });
    }
  }).catch(err => {
    res.status(400).json(err);
  });
});

module.exports = router;
