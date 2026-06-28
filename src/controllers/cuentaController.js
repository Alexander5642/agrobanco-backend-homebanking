// CAPA 2 — CONTROLLER (Cuentas)
const cuentaService = require('../services/cuentaService');
const authService = require('../services/authService');

exports.getMisCuentas = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Token requerido' });

    const usuario = await authService.getUsuarioActual(token);
    if (!usuario) return res.status(401).json({ success: false, message: 'Usuario no válido' });

    const resumen = await cuentaService.getResumenCuentas(usuario.id);
    res.json({ success: true, data: resumen });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
