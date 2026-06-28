const express = require('express');
const router = express.Router();
const creditoController = require('../controllers/creditoController');

router.get('/mis-creditos', creditoController.misCreditos);

module.exports = router;
