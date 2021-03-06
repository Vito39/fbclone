const express = require("express");
const {
  UserModel,
  validateAuthUser,
  validateRegisterUser,
} = require("../models/user");

const asyncMiddleware = require("../Middleware/asyncMiddleware");
const bcrypt = require("bcrypt");
const ProfileModel = require("../models/profile");
const router = express.Router();

router.post(
  "/register",
  asyncMiddleware(async (req, res) => {


   // console.log(req.body);
    let { error } = validateRegisterUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await UserModel.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User Already Registered");
    user = new UserModel({
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, await bcrypt.genSalt(10)),
    });
    let userProfile = new ProfileModel({
      f_name: req.body.f_name,
      l_name: req.body.l_name,
      gender: req.body.gender,
      about: req.body.about,
    });
    user.profile_id = userProfile._id;
    userProfile.user_id = user._id;
    await user.save();
    await userProfile.save();
    return res
      .header("x-auth-token", user.genToken())
      .status(200)
      .send({
        id: userProfile._id,
        f_name: userProfile.f_name,
        l_name: userProfile.l_name,
      });
  })
);

router.post(
  "/auth",
  asyncMiddleware(async (req, res) => {
    const { error } = validateAuthUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const user = await UserModel.findOne({ email: req.body.email });
    const profile = await ProfileModel.findById({ _id: user.profile_id });
    if (!user) return res.status(400).send("Incorrect Email or Password");
    let passwordIsCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordIsCorrect)
      return res.status(401).send("Invalid Email or Password");
    return res.header("x-auth-token", user.genToken()).status(200).send({
      id: user.profile_id,
      f_name: profile.f_name,
      l_name: profile.l_name,
    });
  })
);

module.exports = router;
