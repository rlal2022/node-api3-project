const express = require("express");
const Users = require("./users-model");
const Posts = require("../posts/posts-model");
const {
  validateUser,
  validateUserId,
  validatePost,
} = require("../middleware/middleware");

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get("/", async (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS

  try {
    const user = await Users.get();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "We ran into an error!" });
  }
});

router.get("/:id", validateUserId, async (req, res, next) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: "We ran into an error!" });
  }
});

router.post("/", validateUser, async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  await Users.insert(req.body)
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      next(err);
    });
});

router.put("/:id", validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try {
    const updateUsers = Users.update(req.params.id, req.body);
    res.status(200).json(updateUsers);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  await Users.remove(req.params.id)
    .then((deleteUser) => {
      res.status(200).json(req.user);
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/:id/posts", validateUserId, async (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  await Users.getUserPosts(req.params.id)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      next(err);
    });
});

router.post(
  "/:id/posts",
  validateUserId,
  validatePost,
  async (req, res, next) => {
    // RETURN THE NEWLY CREATED USER POST
    // this needs a middleware to verify user id
    // and another middleware to check that the request body is valid
    await Posts.insert({ user_id: req.params.id, text: req.text })
      .then((post) => {
        res.status(201).json(post);
      })
      .catch((err) => {
        next(err);
      });

    // try {
    //   const returnPost = await Posts.insert({
    //     user_id: req.params.id,
    //     text: req.text,
    //   });
    //   res.status(201).json(returnPost);
    // } catch (err) {
    //   next(err);
    // }
  }
);

router.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message, customMessage: "We ran into an error!" });
});

// do not forget to export the router

module.exports = router;
