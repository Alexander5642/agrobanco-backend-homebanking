const express = require('express');
const router = express.Router();
const operacionController = require('../controllers/operacionController');

router.post('/transferir', operacionController.transferir);
router.post('/pagar-servicio', operacionController.pagarServicio);

module.exports = router;
