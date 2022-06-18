require("dotenv").config();
const express = require("express");
const User = require("../model/user.model");
const authorize = require("../middlewares/authorize");
const jwt = require("jsonwebtoken");
const router = express.Router();
const newToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET_KEY);
};

router.post("/post", async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = newToken(user);
    res.cookie("Bearer ", token, { httpOnly: true });
    return res.status(200).json({ user, token });
  } catch (err) {
    return res.status(400).json(err.message);
  }
});
router.get("/all", async (req, res) => {
  try {
    const user = await User.find().lean().exec();
    return res.status(200).json(user);
  } catch (err) {
    return res.status(400).json({ message: "users not found" });
  }
});

router.post(
  "/login",
  authorize(["admin", "house-holder", "user"]),
  async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      let match;
      if (user) match = user.checkPassword(req.body.password);
      if (!match) {
        return res.status(400).json({
          success: false,
          message: "Incorrect Email or Password",
          authorize: req.auth,
        });
      } else {
        const token = newToken(user);
        res.cookie("Bearer ", token, { httpOnly: true });
        return res.status(200).json({ user, token, authorize: req.auth });
      }
    } catch (err) {
      return res.status(400).json(err.message);
    }
  }
);
router.patch("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .lean()
      .exec();
    return res.status(200).json(user);
  } catch (err) {
    return res.status(400).json(err.message);
  }
});
module.exports = { newToken, router };
