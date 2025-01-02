const { StatusCodes } = require("http-status-codes");
const { transformObjectId } = require("../helper/helper");
const SubGenre = require("../models/sub-genre");
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
    .limit(parseInt(limit));
  res.status(StatusCodes.OK).json({
    data: matchedSubGenre,
  });
});
const getSingleSubGenre = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const subGenre = await SubGenre.findOne({
    slug,
  });
  if (!subGenre) {
    return next(new AppError("Sub Genre not found!", StatusCodes.NOT_FOUND));
  }
  res.status(StatusCodes.OK).json({
    data: subGenre,
  });
});
const createSubGenre = catchAsync(async (req, res, next) => {});
const updateSubGenre = catchAsync(async (req, res, next) => {});
const deleteSubGenre = catchAsync(async (req, res, next) => {});

module.exports = {
  getSubGenre,
  getSingleSubGenre,
  createSubGenre,
  updateSubGenre,
  deleteSubGenre,
};
