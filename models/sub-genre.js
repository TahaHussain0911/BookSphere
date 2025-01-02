const mongoose = require("mongoose");
const { generateSlug } = require("../helper/helper");
const SubGenreModel = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Sub Genre is required"],
    unique: true,
    trim: true,
  },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Genre",
    required: [true, "Genre is required"],
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  slug: {
    type: String,
    unique: true,
    required: true,
  },
});
SubGenreModel.pre("validate", function (next) {
  if (this.isModified("name")) {
    this.slug = generateSlug(this.name);
  }
  next();
});
module.exports = mongoose.model("SubGenre", SubGenreModel);
