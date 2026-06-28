const express = require('express');
const router = express.Router();
const cuentaController = require('../controllers/cuentaController');

router.get('/mis-cuentas', cuentaController.getMisCuentas);

module.exports = router;
