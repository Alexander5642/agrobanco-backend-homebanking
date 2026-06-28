const express = require('express');
const router = express.Router();
const creditoController = require('../controllers/creditoController');

router.get('/mis-creditos', creditoController.misCreditos);
router.post('/solicitar', creditoController.solicitar);
router.get('/all', creditoController.getAll);
router.put('/:id/estado', creditoController.updateEstado);

module.exports = router;
