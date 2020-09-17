const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("GETPLAJESESSSS");
  res.json({ message: "Dete ti ebem" });
});

module.exports = router;
