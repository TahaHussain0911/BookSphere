const { StatusCodes } = require("http-status-codes");
const Genre = require("../models/genre");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const user = require("../models/user");
const SubGenre = require("../models/sub-genre");

const getGenres = catchAsync(async (req, res, next) => {  
  let query = {};
  const { search, page = 1, limit = 10 } = req.query;
  if (search) {
    query.name = {
      $regex: search,
      $options: "i",
    };
  }
  const allGenre = await Genre.find(query)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.status(StatusCodes.OK).json({
    data: allGenre,
  });
});
const getSingleGenre = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const genre = await Genre.findOne({
    slug,
  });
  if (!genre) {
    return next(new AppError("Genre not found!", StatusCodes.NOT_FOUND));
  }
  res.status(StatusCodes.OK).json({
    data: genre,
  });
});
const createGenre = catchAsync(async (req, res, next) => {
  const { slug, ...restBody } = req.body; // donot allow to change slug else can be changed
  const genre = await Genre.create(restBody);
  res.status(StatusCodes.OK).json({
    data: genre,
  });
});
const updateGenre = catchAsync(async (req, res, next) => {
  const { genreId, name, status } = req.body;
  const genre = await Genre.findById(genreId);
  if (!genre) {
    return next(new AppError("Genre not found!", StatusCodes.NOT_FOUND));
  }
  if (name) genre.name = name;
  if (status) genre.status = status;
  await genre.save();
  res.status(StatusCodes.OK).json({
    data: genre,
  });
});
const deleteGenre = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const subGenreExists = await SubGenre.findOne({
    genre: id,
  });
  if (subGenreExists) {
    return next(
      new AppError(
        "Delete all sub genre against this genre. To delete this!",
        StatusCodes.NOT_FOUND
      )
    );
  }
  const genre = await Genre.findByIdAndDelete(id);
  if (!genre) {
    return next(new AppError("Genre not found!", StatusCodes.NOT_FOUND));
  }
  res.status(StatusCodes.OK).json({
    msg: "Genre deleted successfully!",
    data: genre,
  });
});
module.exports = {
  getGenres,
  createGenre,
  getSingleGenre,
  updateGenre,
  deleteGenre,
};
