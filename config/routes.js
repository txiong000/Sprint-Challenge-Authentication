require('dotenv').config();

const axios = require('axios');
const bcrypt = require('bcrypt');
const { authenticate, generateToken } = require('./middlewares');
const jwt = require('jsonwebtoken');
const db = require('../database/dbConfig');


module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};


function register(req, res) {
  // implement user registration
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 14);

  creds.password = hash;
  db('users')
   .insert(creds)
   .then(ids => {
     res.status(201).json({message: 'Registration success', ids})
   })
   .catch(err => {
     res.status(404).json({message: 'unable to register'});
   })



}

function login(req, res) {
  // implement user login
  const creds = req.body;

  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        const token = generateToken(user);
        res.status(201).json({ message: 'Login Success', token})
      } else {
        res.status(401).json({ message: 'Login Failed'})
      }
    })
    .catch(err => res.json({message: 'Fail to login'}));
}

function getJokes(req, res) {
  axios
    .get(
      'https://safe-falls-22549.herokuapp.com/random_ten'
    )
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
