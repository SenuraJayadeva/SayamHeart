const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const Validator = require("validator");

//Bring User Model
const User = require("../../models/User");

//Load password validation
//const validateRegisterInput = require("../../validation/register");

router.get("/", (req, res) => res.send("user route"));

//@route  POST api/users
//@desc   register user
//@access Public
router.post(
  "/",
  [check("email", "Please include a valid email").isEmail()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      //See if user Exist
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exist" }] });
      }

      //create a user instance
      user = new User({
        email,
        password,
      });

      //Encrypt Password

      //10 is enogh..if you want more secured.user a value more than 10
      const salt = await bcrypt.genSalt(10);

      //hashing password
      user.password = await bcrypt.hash(password, salt);

      //save user to the database
      await user.save();

      //Return jsonwebtoken

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      //Something wrong with the server
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
