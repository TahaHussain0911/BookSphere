const express = require("express");
const {
  getSubGenre,
  getSingleSubGenre,
  createSubGenre,
  updateSubGenre,
  deleteSubGenre,
} = require("../controllers/sub-genre");
const {
  handleAuthorize,
  handleAuthorizeAdmin,
} = require("../middlewares/authorization");
const router = express.Router();

router.get("/", getSubGenre).get("/:slug", getSingleSubGenre);

router.use([handleAuthorize, handleAuthorizeAdmin]);

router.post("/", createSubGenre);

router.patch("/", updateSubGenre);
router.delete("/:id", deleteSubGenre);

module.exports = router;
