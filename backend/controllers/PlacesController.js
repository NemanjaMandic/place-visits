const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const Place = require("../models/Place");
const HttpError = require("../models/HttpError");
const getCoordsFromAddress = require("../utils/location");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the bigest sky scrapers in the world",
    imageUrl:
      "https://www.great-towers.com/sites/default/files/2019-07/tower_0.jpg",
    address: "20 W 34th St, New York, NY 100001",
    location: {
      lat: 40.748433,
      lng: -73.985656,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire State Building building",
    description: "One of the bigest sky scrapers in the world",
    imageUrl:
      "https://www.great-towers.com/sites/default/files/2019-07/tower_0.jpg",
    address: "20 W 34th St, New York, NY 100001",
    location: {
      lat: 40.748433,
      lng: -73.985656,
    },
    creator: "u2",
  },
];

const getPlacesById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
  if (!place) {
    const error = HttpError("Could not find a place with provided id", 404);
    return next(error);
  }
  res.json({ place: (await place).toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    return next(new HttpError("Something wen wrong", 500));
  }
  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find a places with provided user id", 404)
    );
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  console.log("req ", req);
  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsFromAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://scontent.fbeg2-1.fna.fbcdn.net/v/t1.0-9/125350583_2695204910791251_4233854942407038541_o.jpg?_nc_cat=110&ccb=2&_nc_sid=730e14&_nc_ohc=xD0V-7Pj2F0AX8q9BtR&_nc_ht=scontent.fbeg2-1.fna&oh=bb7fc0520a17818f5e8a4c8c7c82ed70&oe=5FD8774A",
    creator,
  });

  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }
  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place",
      500
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
    await place.remove();
  } catch (err) {
    const error = new HttpError("Could not delete place", 500);
    return next(error);
  }
  res.status(200).json({ message: "Deleted place." });
};

exports.getPlacesById = getPlacesById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
