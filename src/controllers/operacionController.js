// CAPA 2 — CONTROLLER (Operaciones)
const operacionService = require('../services/operacionService');
const authService = require('../services/authService');

exports.transferir = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Token requerido' });
    const usuario = await authService.getUsuarioActual(token);
    if (!usuario) return res.status(401).json({ success: false, message: 'Usuario no válido' });

    const { cuentaOrigenId, numeroCuentaDestino, monto, descripcion } = req.body;
    if (!cuentaOrigenId || !numeroCuentaDestino || !monto || monto <= 0) {
      return res.status(400).json({ success: false, message: 'Parámetros inválidos' });
    }

    const resultado = await operacionService.realizarTransferencia(usuario.id, cuentaOrigenId, numeroCuentaDestino, monto, descripcion || '');
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.pagarServicio = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Token requerido' });
    const usuario = await authService.getUsuarioActual(token);
    if (!usuario) return res.status(401).json({ success: false, message: 'Usuario no válido' });

    const { cuentaOrigenId, monto, servicio } = req.body;
    if (!cuentaOrigenId || !monto || monto <= 0 || !servicio) {
      return res.status(400).json({ success: false, message: 'Parámetros inválidos' });
    }

    const resultado = await operacionService.pagarServicio(usuario.id, cuentaOrigenId, monto, servicio);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
