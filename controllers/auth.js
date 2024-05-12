const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const { User } = require("../models/user");

const { ctrlWrapper, HttpError } = require("../helpers");
const Jimp = require("jimp");

const { SECRET_KEY } = process.env;
// зберігаємо шлях до папки
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email already in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });
  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
    subscription: newUser.subscription,
    avatarURL,
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

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  // ===
  // await User.findByIdAndUpdate(user._id);
  // ===
  await User.findByIdAndUpdate(user._id, { token });
  res.status(200).json({
    user: {
      email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    },
    token,
  });
};
// Отримати текущего users
const getCurrent = async (req, res) => {
  const { name, email, subscription, avatarURL } = req.user;

  if (!email) {
    throw HttpError(401, "Not authorized");
  }

  res.status(200).json({
    name,
    email,
    subscription,
    avatarURL,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({
    message: "Logout success",
  });
  // res.json({
  //   message: "Logout success",
  // });
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

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  try {
    const resultUpload = path.join(avatarsDir, filename);
    await fs.rename(tempUpload, resultUpload);

    const avatar = await Jimp.read(resultUpload);

    await avatar.resize(250, 250).write(resultUpload);

    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({
      avatarURL,
    });
  } catch (error) {
    await fs.unlink(req.file.path);
    throw error;
  }
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateStatusSubscription,
  updateAvatar: ctrlWrapper(updateAvatar),
};
