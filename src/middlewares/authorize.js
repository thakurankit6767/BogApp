const User = require("../model/user.model");
const Data = require("../model/data.model");

const authorise = (permittedRoles) => {
  return async (req, res, next) => {
    const userAllowed = await User.findOne({ email: req.body.email })
      .lean()
      .exec();
    console.log(userAllowed);
    let isPermitted = 0;
    if (userAllowed) {
      if (userAllowed.type === "admin") {
        isPermitted = 1;
      } else if (userAllowed.type === "house-holder") {
        isPermitted = 2;
      } else if (userAllowed.type === "user") {
        isPermitted = 3;
      }
    }
    if (isPermitted === 0) {
      req.auth = "Permission denied";
    } else if (isPermitted === 1) {
      req.auth = "Permission granted for all";
    } else if (isPermitted === 2) {
      req.auth = "Permission granted for add house";
    } else if (isPermitted === 3) {
      req.auth = "Permission granted to add pet";
    }

    return next();
  };
};

module.exports = authorise;
