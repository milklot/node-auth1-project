const model = require('../users/users-model');

function restricted() {
  return async(req, res, next) => {
    try {
      if (!req.session || !req.session.user) {
        return res.status(401).json({
          message: "You shall not pass!"
        })
      }
      next();
    }
    catch(err) {
      next(err);
    }
  }
}

async function checkUsernameFree(req, res, next) {
  const { username } = req.body
  const user = await model.findBy({username}).first();
  
  if (user){
      res.status(422).json({
        message:"Username taken"
      })
  }
  else {
      next()
  }
}

async function checkUsernameExists(req, res, next) {
  const user = await model.findBy(req.body.username)
  
  if (!user){
      res.status(401).json({
        message:"Invalid credentials"
      })
  }
  else {
      req.user = user;
      next()
  }
}

function checkPasswordLength() {
  return (req, res, next) => {
    const password = req.body.password;

    if (!password || password.length < 4) {
      return res.status(422).json({
        message: "Password must be longer than 3 chars"
      })
    }
    else {
      next();
    }
  }
}

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
}