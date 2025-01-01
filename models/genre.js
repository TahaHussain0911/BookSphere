const mongoose = require("mongoose");
const { generateSlug } = require("../helper/helper");
const GenreModel = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
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
  },
  {
    timestamps: true,
  }
);
GenreModel.pre("validate", async function (next) {
  if (this.isModified("name")) {
    this.slug = generateSlug(this.name);
  }
  next();
});

module.exports = mongoose.model("Genre", GenreModel);
