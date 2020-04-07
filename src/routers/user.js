const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("Sharp");
const {
  sendWelcomeEmail,
  sendCancellationEmail
} = require("../emails/account");
router.get("/test", (req, res) => {
  res.send("from a new File.");
});

// Create user method
router.post("/users", async (req, res) => {
  //   console.log(req.body);
  const user = new User(req.body);
  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
    // res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();

    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.status(200).send(req.user);
  // try {
  //   const users = await User.find({});
  //   res.status(200).send(users);
  // } catch (e) {
  //   res.status(500).send();
  // }
  //   User.find({})
  //     .then(users => {
  //       res.status(200).send(users);
  //     })
  //     .catch(e => {
  //       res.status(500).send(e);
  //     });
});
router.get("/users/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findById(_id);
    if (!user) {
      res.status(404).send();
    }
    res.status(200).send(user);
  } catch (e) {
    res.send(e);
  }
  // Promise approach
  //   User.findById(req.params.id)
  //     .then(user => {
  //       if (!user) {
  //         return res.status(404).send();
  //       }
  //       res.status(200).send(user);
  //     })
  //     .catch(e => {
  //       res.status(500).send();
  //     });
});

// Update user
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "password", "age"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ Error: "Not a valid update!" });
  }

  try {
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true
    // });
    // const user = await User.findById(req.params.id);
    updates.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/users/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "password", "age"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ Error: "Not a valid update!" });
  }

  try {
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true
    // });
    const user = await User.findById(req.params.id);
    updates.forEach(update => (user[update] = req.body[update]));
    await user.save();
    if (!user) {
      res.status(404).send();
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// delete User
router.delete("/users/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.params.id);
    // if (!user) {
    //   res.status(400).send();
    // }
    await req.user.remove();
    sendCancellationEmail(req.user.email, req.user.name);
    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(400).send();
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send();
  }
});

const upload = multer({
  limits: {
    fileSize: 2000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(
        new Error("You are only allowed to upload jpg, jpeg or png images!")
      );
    }
    return cb(undefined, true);
  }
});

router.post(
  "/users/me/avator",
  auth,
  upload.single("avator"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250 })
      .png()
      .toBuffer();
    req.user.avator = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/users/me/avator", auth, async (req, res) => {
  req.user.avator = undefined;
  req.user.save();
  res.send();
});

router.get("/users/:id/avator", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avator) {
      throw new Error();
    }
    res.set("Content-Type", "image/jpg");
    res.send(user.avator);
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;
