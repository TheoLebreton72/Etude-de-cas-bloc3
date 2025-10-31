const express = require("express");
const articleController = require("./articles.controller");
const auth = require("../../middlewares/auth");
const router = express.Router();

router.get("/", auth, articleController.getAll);
router.get("/:id", auth, articleController.getById);
router.post("/", auth, articleController.create);
router.put("/:id", auth, articleController.update);
router.delete("/:id", auth, articleController.delete);

module.exports = router;
