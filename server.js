require("dotenv").config();
const express = require("express");
const connectDb = require("./database/connect");
const routeNotFound = require("./middlewares/not-found");
const globalErrorHandler = require("./middlewares/global-error");
const app = express();
const UserRouter = require("./routes/user");
const GenreRouter = require("./routes/genre");
const SubGenreRouter = require("./routes/sub-genre");
const PORT = process.env.NODE_PORT;
const MONGO_URL = process.env.DATABASE_URL;
app.use(express.json());
app.use("/api/v1/auth", UserRouter);
app.use("/api/v1/genre", GenreRouter);
app.use("/api/v1/sub-genre", SubGenreRouter);

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
