const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models/user");

const { ctrlWrapper, HttpError } = require("../helpers");

// const SECRET_KEY = process.env;
const SECRET_KEY = "l+^0ASYi!Zt9G-pSG*HkdCX2%3B0E8";
const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email already in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });
  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };
  console.log(process.env.SECRET_KEY);
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  // console.log(token);
  // ===
  // await User.findByIdAndUpdate(user._id);
  // ===
  await User.findByIdAndUpdate(user._id, { token });
  res.status(200).json({
    token,

    user: {
      email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  if (!email) {
    throw HttpError(401, "Not authorized");
  }

  res.status(200).json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({
    message: "Logout success",
  });
};

const updateStatusSubscription = async (req, res, next) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  console.log(subscription);
  console.log(["starter", "pro", "business"].includes(subscription));

  if (!["starter", "pro", "business"].includes(subscription)) {
    throw HttpError(400, "Invalid subscription value");
  }
  const updatedUser = await User.findOneAndUpdate(
    _id,
    { subscription },
    {
      new: true,
    }
  );

  if (!updatedUser) {
    throw HttpError(404, "User not found");
  }
  res.status(200).json({
    email: updatedUser.email,

    subscription: updatedUser.subscription,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateStatusSubscription,
};

// ----------------------------------

// // const bcrypt = require("bcrypt");
// // const jwt = require("jsonwebtoken");

// const { User } = require("../models/user");

// const { ctrlWrapper } = require("../helpers");

// // const { SECRET_KEY } = process.env;

// const register = async (req, res) => {
//   // const { email, password } = req.body;
//   // const user = await User.findOne({ req.body });

//   //   if (user) {
//   //     throw HttpError(409, "Email already in use");
//   //   }
//   //   const hashPassword = await bcrypt.hash(password, 10);
//   const newUser = await User.create(req.body);
//   res.status(201).json({
//     name: newUser.name,
//     email: newUser.email,
//     subscription: newUser.subscription,
//   });
// };

// // const login = async (req, res) => {
// //   const { email, password } = req.body;

// //   const user = await User.findOne({ email });

// //   if (!user) {
// //     throw HttpError(401, "Email or password is wrong");
// //   }
// //   const passwordCompare = await bcrypt.compare(password, user.password);
// //   if (!passwordCompare) {
// //     throw HttpError(401, "Email or password is wrong");
// //   }

// //   const payload = {
// //     id: user._id,
// //   };

// //   const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
// //   // ===
// //   // await User.findByIdAndUpdate(user._id);
// //   // ===
// //   await User.findByIdAndUpdate(user._id, { token });
// //   res.status(200).json({
// //     token,

// //     user: {
// //       email,
// //       subscription: user.subscription,
// //     },
// //   });
// // };

// // const getCurrent = async (req, res) => {
// //   const { email, subscription } = req.user;

// //   if (!email) {
// //     throw HttpError(401, "Not authorized");
// //   }

// //   res.status(200).json({
// //     email,
// //     subscription,
// //   });
// // };

// // const logout = async (req, res) => {
// //   const { _id } = req.user;
// //   await User.findByIdAndUpdate(_id, { token: "" });

// //   res.status(204).json({
// //     message: "Logout success",
// //   });
// // };

// // const updateStatusSubscription = async (req, res, next) => {
// //   const { _id } = req.user;
// //   const { subscription } = req.body;
// //   console.log(subscription);
// //   console.log(["starter", "pro", "business"].includes(subscription));

// //   if (!["starter", "pro", "business"].includes(subscription)) {
// //     throw HttpError(400, "Invalid subscription value");
// //   }
// //   const updatedUser = await User.findOneAndUpdate(
// //     _id,
// //     { subscription },
// //     {
// //       new: true,
// //     }
// //   );

// //   if (!updatedUser) {
// //     throw HttpError(404, "User not found");
// //   }
// //   res.status(200).json({
// //     email: updatedUser.email,

// //     subscription: updatedUser.subscription,
// //   });
// // };

// module.exports = {
//   register: ctrlWrapper(register),
//   // login: ctrlWrapper(login),
//   // getCurrent: ctrlWrapper(getCurrent),
//   // logout: ctrlWrapper(logout),
//   // updateStatusSubscription,
// };
