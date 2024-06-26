const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

// const sexList = ["man", "woman"];

// mongoose-схема перевіряє  , те що ми зберігаємо в базі
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
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    // sex: {
    //   type: String,
    //   enum: sexList,
    // },
  },
  { versionKey: false, timestamps: true }
);

// joiSchema - перевіряє тіло запиту, те що нам приходить
const joiSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.bool().required(),
  // sex: Joi.string().validate(...).required(),
});

const favoriteJoiSchema = Joi.object({
  favorite: Joi.bool().required(),
});
contactSchema.post("save", handleMongooseError);
const schemas = { joiSchema, favoriteJoiSchema };

const Contact = model("contact", contactSchema);

module.exports = { Contact, schemas };
