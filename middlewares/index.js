const validateBody = require("./validateBody");
const isValidId = require("./isValidId");
// const handleMongooseError = require("../helpers/handleMongooseError");
const authenticate = require("./authenticate");
const upload = require("./upload");
module.exports = {
  validateBody,
  isValidId,
  // handleMongooseError,
  upload,
  authenticate,
};
