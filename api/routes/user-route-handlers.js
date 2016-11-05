const mongoose = require('mongoose');
const User = require('../data/models/user');
const jwt = require('jwt-simple');

const ObjId = mongoose.Types.ObjectId;

const log = require('../helpers/log');
const send500 = require('../helpers/send500');
const send404 = require('../helpers/send404');

exports.getUsers = (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      log.error(err);
      send404(res, 'No Users Found')
      return;
    }
    res.status(200).json(users);
  })
};

// TODO(Mitch): Needs testing.
exports.getUserById = (req, res) => {
  console.log('request received');
  const id = req.params.id;
  User.findById(id)
  .then(user => {
    console.log(user)
    res.status(200).json({createdLessons: user.createdLessons})
  })
};

exports.signin = (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({name: username})
    .then(user => {
      if (!user) {
        res.status(404).send('User does not exist')
      } else {
        user.comparePassword(password, user.password, (error, match) => {
          if (match) {
            var token = jwt.encode(user.toString(), 'scriptyyyy');
            res.json({token: token, id: user._id});
          } else {
            res.send(401, 'password is not correct');
          }
        })
      }
    })
};

exports.createUser = (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email
  User.findOne({ name: username })
    .then((user) =>{
      if (!user) {
        var newUser = new User({
          name: username,
          password: password,
          email: email
        });
        newUser.save((error, newUser) => {
          var token = jwt.encode(newUser.toString(), 'scriptyyyy');
          res.send({token: token, id: newUser._id});
        })
      } else {
        res.send(404, 'User already exist!');
      }
    });
};

exports.updateUserById = (req, res) => {
  const id = req.params.id;
  //TODO(Mitch): Fill me in!
};

exports.deleteUserById = (req, res) => {
  const id = req.params.id;
  //TODO(Mitch): Fill me in!
};