const mongoose = require("mongoose");
const connectDb = (url) => {
  return mongoose
    .connect(url)
    .then(() => {
      console.log("Database connected!");
    })
    .catch((err) => console.log("Database Error->", err));
};
module.exports = connectDb;
