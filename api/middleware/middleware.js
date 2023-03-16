const Users = require("../users/users-model");

function logger(req, res, next) {
  console.log({
    time: new Date().toLocaleString(),
    method: req.method,
    url: req.originalUrl,
  });
  next();
}

async function validateUserId(req, res, next) {
  try {
    const users = await Users.getById(req.params.id);
    if (users) {
      req.user = users;
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (err) {
    next(err);
  }
}

function validateUser(req, res, next) {
  const { name } = req.body;
  if (name || name.trim()) {
    next();
  } else {
    res.status(400).json({ message: "missing required name field" });
  }
}

function validatePost(req, res, next) {
  const { text } = req.body;
  if (text || text.trim()) {
    req.text = text;
    next();
  } else {
    res.status(400).json({ message: "missing required text field" });
  }
}

// do not forget to expose these functions to other modules

module.exports = { logger, validateUserId, validateUser, validatePost };
