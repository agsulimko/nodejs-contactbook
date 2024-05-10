const express = require("express");
const ctrl = require("../../controllers/contacts");

const { validateBody, authenticate, isValidId } = require("../../middlewares");
const { schemas } = require("../../models/contact");

const router = express.Router();

router.get("/", authenticate, ctrl.getAll);

router.get("/:contactId", authenticate, isValidId, ctrl.getById);

router.post("/", authenticate, validateBody(schemas.joiSchema), ctrl.add);

router.put(
  "/:contactId",

  authenticate,
  isValidId,

  validateBody(schemas.joiSchema),
  ctrl.updateById
);

router.patch(
  "/:contactId/favorite",

  authenticate,
  isValidId,
  validateBody(schemas.favoriteJoiSchema),
  ctrl.updateStatusContact
);

router.delete("/:contactId", authenticate, isValidId, ctrl.deleteById);

module.exports = router;
