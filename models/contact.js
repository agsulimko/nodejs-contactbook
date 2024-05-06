const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../middlewares");

const contactSchema = new Schema(
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
      // match:
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    // sex: {
    //   type: String,
    //   enum: ["man", "woman"],
    // },
  },
  { versionKey: false, timestamps: true }
);
contactSchema.post("save", handleMongooseError);

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

const Contact = model("contact", contactSchema);

module.exports = { Contact, schemas };
