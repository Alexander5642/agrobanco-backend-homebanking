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

exports.solicitar = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Token requerido' });
    const usuario = await authService.getUsuarioActual(token);
    if (!usuario) return res.status(401).json({ success: false, message: 'Usuario no válido' });

    const newCredito = await creditoService.solicitarCredito(usuario.id, req.body);
    res.json({ success: true, data: newCredito });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Token requerido' });
    const usuario = await authService.getUsuarioActual(token);
    if (!usuario || usuario.rol !== 'ADMIN') return res.status(403).json({ success: false, message: 'Acceso denegado' });

    const creditos = await creditoService.getAllCreditos();
    res.json({ success: true, data: creditos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateEstado = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Token requerido' });
    const usuario = await authService.getUsuarioActual(token);
    if (!usuario || usuario.rol !== 'ADMIN') return res.status(403).json({ success: false, message: 'Acceso denegado' });

    const updated = await creditoService.updateCreditoEstado(req.params.id, req.body.estado);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
