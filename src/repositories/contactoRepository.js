const { pool } = require('../config/db');

exports.createContacto = async (contactoData) => {
  const { nombre, telefono, email, mensaje } = contactoData;
  const id = 'con-' + Date.now();
  await pool.query(
    'INSERT INTO contactos (id, nombre, telefono, email, mensaje) VALUES ($1, $2, $3, $4, $5)',
    [id, nombre, telefono, email, mensaje]
  );
  return { id, nombre, telefono, email, mensaje };
};

exports.getContactos = async () => {
  const { rows } = await pool.query('SELECT * FROM contactos ORDER BY fecha DESC');
  return rows;
};
