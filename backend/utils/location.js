const axios = require("axios");
const HttpError = require("../models/HttpError");

const API_KEY = "AIzaSyCzwIc6IrwGufiBSXtuvwkw-Xso2ZcHxUU";

async function getCoordsFromAddress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    throw new HttpError(
      "Could not find location for the specified address",
      422
    );
  }
  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordsFromAddress;
