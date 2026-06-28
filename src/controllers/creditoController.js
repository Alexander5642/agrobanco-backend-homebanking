// CAPA 2 — CONTROLLER (Creditos)
const creditoService = require('../services/creditoService');
const authService = require('../services/authService');

exports.misCreditos = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Token requerido' });
    const usuario = await authService.getUsuarioActual(token);
    if (!usuario) return res.status(401).json({ success: false, message: 'Usuario no válido' });

    const creditos = await creditoService.getCreditosUsuario(usuario.id);
    res.json({ success: true, data: creditos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
