require('dotenv').config();

const axios = require('axios');
const bcrypt = require('bcrypt');
const { authenticate } = require('./middlewares');
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
     res.status(201).json(ids)
   })
   .catch(err => {
     res.status(404).json({message: 'unable to register'});
   })



}

function login(req, res) {
  // implement user login
  
    const { username, password } = req.body;
    db('users')
      .select('hash')
      .where('username', '=', username)
      .first()
      .then(({ hash }) => {
        return bcrypt.compare(password, hash)
      })
      .then((verdict) => {
        if (verdict) {
          const token = jwt.sign({ username }, secret, { expiresIn: '24h' });
          res.status(200).json(token);
        } else {
          res.status(406).json({ message: 'System could not log user in.' });
        }
      })
      .catch((err) => {
        console.log('An error occurred', err);
        res.status(400).json({ message: 'An error occurred when attempting log-in.' });
      });
}

function getJokes(req, res) {
  axios
    .get(
      'https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_ten'
    )
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
