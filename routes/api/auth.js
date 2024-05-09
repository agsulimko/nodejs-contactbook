const express = require("express");
const ctrl = require("../../controllers/auth");
const { validateBody, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/user");

const router = express.Router();
// singup
router.post(
  "/users/register",
  validateBody(schemas.registerSchema),
  ctrl.register
);
// singin
router.post("/users/login", validateBody(schemas.loginSchema), ctrl.login);

router.get("/users/current", authenticate, ctrl.getCurrent);

// singout
router.post("/users/logout", authenticate, ctrl.logout);

router.patch("/users", authenticate, ctrl.updateStatusSubscription);

module.exports = router;
