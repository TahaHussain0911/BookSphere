const express = require("express");
const {
  handleAuthorize,
  handleAuthorizeAdmin,
} = require("../middlewares/authorization");
const {
  getGenres,
  createGenre,
  getSingleGenre,
  updateGenre,
  deleteGenre,
} = require("../controllers/genre");
const router = express.Router();

router.get("/", getGenres).get("/:slug", getSingleGenre);
router.use([handleAuthorize, handleAuthorizeAdmin]);
router.post("/", createGenre);
router.patch("/", updateGenre);
router.delete("/:id", deleteGenre);

module.exports = router;
