const express = require("express");
const usersController = require("./users.controller");
const auth = require("../../middlewares/auth");
const router = express.Router();

router.get("/", auth, usersController.getAll);
router.get("/:id",auth, usersController.getById);
router.post("/",auth, usersController.create);
router.put("/:id",auth, usersController.update);
router.delete("/:id",auth, usersController.delete);

//pas protégé par le middleware
router.get("/:userId/articles", usersController.getUserArticles);

module.exports = router;
