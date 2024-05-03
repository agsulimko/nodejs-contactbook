const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../middlewares");

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);
contactsSchema.post("save", handleMongooseError);

const joiSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.bool().required(),
});

const favoriteJoiSchema = Joi.object({
  favorite: Joi.bool().required(),
});

const schemas = { joiSchema, favoriteJoiSchema };

const Contacts = model("contact", contactsSchema);

module.exports = { Contacts, schemas };
