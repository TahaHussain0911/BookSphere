const { StatusCodes } = require("http-status-codes");
const { transformObjectId } = require("../helper/helper");
const SubGenre = require("../models/sub-genre");
const Genre = require("../models/genre");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const getSubGenre = catchAsync(async (req, res, next) => {
  const { search, genre, page = 1, limit = 10 } = req.query;
  let query = {};
  if (search) {
    query.name = {
      $regex: search,
      $options: "i",
    };
  }
  if (genre) {
    // query.genre = {
    //   $match: {
    //     $genre: genre,
    //   },
    // };
    const genreId = transformObjectId(genre);
    query.genre = genreId;
  }
  const matchedSubGenre = await SubGenre.find(query)
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate("genre");
  res.status(StatusCodes.OK).json({
    data: matchedSubGenre,
  });
});
const getSingleSubGenre = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const subGenre = await SubGenre.findOne({
    slug,
  }).populate("genre");
  if (!subGenre) {
    return next(new AppError("Sub Genre not found!", StatusCodes.NOT_FOUND));
  }
  res.status(StatusCodes.OK).json({
    data: subGenre,
  });
});
const createSubGenre = catchAsync(async (req, res, next) => {
  const { genre, name } = req.body;
  if (!genre || !name) {
    return next(
      new AppError("Genre and name are required!", StatusCodes.BAD_REQUEST)
    );
  }
  const genreExists = await Genre.findById(genre);
  if (!genreExists) {
    return next(new AppError("Genre not found!", StatusCodes.NOT_FOUND));
  }
  const sub_genre_created = await SubGenre.create({
    genre,
    name,
  });
  sub_genre_created.genre = genreExists;
  res.status(StatusCodes.CREATED).json({
    data: sub_genre_created,
  });
});
const updateSubGenre = catchAsync(async (req, res, next) => {
  const { name, genre, subGenreId } = req.body;
  const subGenre = await SubGenre.findById(subGenreId);
  if (!subGenre) {
    return next(new AppError("Sub Genre not found!", StatusCodes.NOT_FOUND));
  }
  if (genre && genre !== subGenre?.genre) {
    const genreFound = await Genre.findById(genre);
    if (!genreFound) {
      return next(new AppError("Genre not found!", StatusCodes.NOT_FOUND));
    }
    subGenre.genre = genre;
  }
  if (name?.trim()) {
    subGenre.name = name;
  }
  const populated_SubGenre = await (await SubGenre.save()).populate("genre");
  res.status(StatusCodes.OK).json({
    msg: "Sub Genre Updated",
    data: populated_SubGenre,
  });
});
const deleteSubGenre = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deletedSubGenre = await SubGenre.findByIdAndDelete(id);
  if (!deletedSubGenre) {
    return next(new AppError("Sub Genre Not Found", StatusCodes.NOT_FOUND));
  }
  res.status(StatusCodes.OK).json({
    msg: "Sub Genre deleted successfully",
    data: deletedSubGenre,
  });
});

module.exports = {
  getSubGenre,
  getSingleSubGenre,
  createSubGenre,
  updateSubGenre,
  deleteSubGenre,
};
