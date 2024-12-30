require("dotenv").config();
const express = require("express");
const connectDb = require("./database/connect");
const routeNotFound = require("./middlewares/not-found");
const globalErrorHandler = require("./middlewares/global-error");
const app = express();
const PORT = process.env.NODE_PORT;
const MONGO_URL = process.env.DATABASE_URL;

app.get("/", (req, res, next) => {
  try {
    const string = "hello user";
    string = string.map((ele) => ele);
    return res.send("Hello World!");
  } catch (error) {
    next(error);
  }
});

app.all("*", routeNotFound);
app.use(globalErrorHandler);
const start = async () => {
  try {
    await connectDb(MONGO_URL);
    app.listen(PORT, () => {
      console.log(`Server listening on PORT ${PORT}`);
    });
  } catch (error) {
    console.log(error, "errro");
  }
};
start();
