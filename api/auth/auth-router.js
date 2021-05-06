const mw = require('./auth-middleware');
const users = require('../users/users-model');
const router = require('express').Router();
const bcrypt = require('bcryptjs');


router.post('/register', mw.checkPasswordLength(), mw.checkUsernameFree, async (req, res, next) => {

    const hash = bcrypt.hashSync(req.body.password, 2)

    users.add({
        username: req.body.username,
        password: hash
      })
    .then((user) => {
        res.status(200).json(user)
    })
})

router.post('/login', mw.checkPasswordLength(), mw.checkUsernameExists, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await users.findBy({username}).first();
    const passwordValid = await bcrypt.compare(password, user.password);
  
    if (passwordValid) {
      req.session.user = user
      res.status(200).json({
        message: `Welcome ${user.username}!`
      })
    }
    else {
      res.status(401).json({
        message: "invalid credentials"
      })
    }
  }
  catch(err) {
    next(err);
  }
})


router.delete('/logout', mw.restricted(), async (req, res, next) => {

  if (!req.session && !req.session.user) {
    res.status(401).json({
      message: "no session"
    })
  }

  else {
    try {
      req.session.destroy((err) => {
        if (err) {
          next(err);
        }
        else {
          res.status(200).json({
            message: "logged out"
          })
        }
      })
    }
    catch(err) {
      next(err);
    }
  }
})

module.exports = router;
