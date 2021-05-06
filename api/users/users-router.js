// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!
const users = require('./users-model');
const { restricted } = require('../auth/auth-middleware');
const router = require('express').Router();


router.get('/', restricted(), async (req, res, next) => {
  try {
    res.status(200).json(await users.find());
  }
  catch(err) {
    next(err);
  }
})

module.exports = router;
