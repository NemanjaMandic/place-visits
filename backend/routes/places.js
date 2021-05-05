const express = require('express');
const placesController = require('../controllers/PlacesController');
const { check } = require('express-validator');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/:pid', placesController.getPlacesById);

router.get('/user/:uid', placesController.getPlacesByUserId);

router.use(checkAuth);

router.post(
  '/',
  [
    check('title').notEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').notEmpty(),
  ],
  placesController.createPlace
);

router.patch(
  '/:pid',
  [[check('title').notEmpty(), check('description').isLength({ min: 5 })]],
  placesController.updatePlace
);

router.delete('/:pid', placesController.deletePlace);

module.exports = router;
