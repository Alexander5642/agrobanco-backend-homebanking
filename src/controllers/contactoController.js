const contactoRepository = require('../repositories/contactoRepository');

exports.crearContacto = async (req, res) => {
  try {
    const data = req.body;
    if (!data.nombre || !data.telefono || !data.email) {
      return res.status(400).json({ success: false, message: 'Faltan datos obligatorios' });
    }
    const result = await contactoRepository.createContacto(data);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.obtenerContactos = async (req, res) => {
  try {
    const result = await contactoRepository.getContactos();
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
