require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const utils = require('./utils');
const db = require('./config/db')
const app = express();
const port = process.env.PORT || 4000;

// static user details
// let userData = {
//   id: "1",
//   password: "123456",
//   name: "TDF",
//   description: "TTHANH DAT FACADE",
//   admin: 0,
// };


// enable CORS
app.use(cors());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


//middleware that checks if JWT token exists and verifies it if it does exist.
//In all future routes, this helps to know if the request is authenticated or not.
app.use(function (req, res, next) {
  // check header or url parameters or post parameters for token

  var token = req.headers['authorization'];
  if (!token) return next(); //if no token, continue

  token = token.replace('Bearer ', '');
  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) {
      return res.status(401).json({
        error: true,
        message: "Invalid user."
      });
    } else {
      req.user = user; //set the user to req so other routes can use it
      next();
    }
  });

});



// request handlers
app.get('/', (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Invalid user to access it.' });
  res.send('Welcome to the Node.js Tutorial! - ' + req.user.name);
});






app.post('/users/signup', function (req, res) {
  console.log('We are at sign up......!');
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;


  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      if (err) { console.log(err.message) };
      db.query("INSERT INTO users (email, password, name) VALUES (?,?,?)", [email, hash, name], (err, result) => {
        if (err) {
          if (err.errno === 1062) {
            return res.status(406).json({
              error: true,
              message: "The email had been registered!"
            });
          } else {
            return res.status(409).json({
              error: true,
              message: err.message
            });
          }
        } else {
          console.log(result);
        }
      });
    });
  });

})



// validate the user credentials
app.post('/users/signin', function (req, res) {
  console.log('We are at signin......!');
  const email = String(req.body.email);
  const password = String(req.body.password);
  db.query("SELECT * FROM users WHERE email = ?", email, (err, result) => {
    if (err) { console.log(err) }

    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: "Username or Password required."
      });
    }

    if (result[0]) {
      bcrypt.compare(password, result[0].password, function (err, resPassword) {
        if (!resPassword) {
          return res.status(401).json({
            error: true,
            message: "Password was not correct!"
          });
        } else {

          let userData = result[0];

          // generate token
          const token = utils.generateToken(userData);
          // get basic user details
          const userObj = utils.getCleanUser(userData);
          // return the token along with user details
          return res.json({ user: userObj, token });
        }

      });
    } else {
      return res.status(401).json({
        error: true,
        message: "Username or Password is Wrong."
      });
    }

    // return 400 status if username/password is not exist

    // return 401 status if the credential is not match.
    // if (user !== userData.name || pwd !== userData.password) {
    // }


  });

});


// verify the token and return it if it's valid
app.get('/verifyToken', function (req, res) {

  console.log('We are at veryfy token!');
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token;
  if (!token) {
    return res.status(400).json({
      error: true,
      message: "Token is required."
    });
  }
  // check token that was passed by decoding token using secret
  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) {
      return res.status(401).json({
        error: true,
        message: "Invalid token."
      })
    };

    // return 401 status if the userId does not match.
    if (user.id !== userData.id) {
      return res.status(401).json({
        error: true,
        message: "Invalid user."
      });
    }
    // get basic user details
    var userObj = utils.getCleanUser(userData);
    return res.json({ user: userObj, token });
  });
});

app.listen(port, () => {
  console.log('Server started on: ' + port);
});
