const routes = require('express').Router();

const { User } = require('./app/models/');

routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Victor',
    email: 'victor@email.com',
    password_hash: 'adasdaad'
  });

  return res.json({ user });
});

module.exports = routes;
