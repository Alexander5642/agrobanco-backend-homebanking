const { pool } = require('../config/db');

exports.getCuentasByUserId = async (userId) => {
  const { rows } = await pool.query('SELECT * FROM cuentas WHERE user_id = $1', [userId]);
  return rows;
};

exports.getTarjetasByUserId = async (userId) => {
  const { rows } = await pool.query('SELECT * FROM tarjetas WHERE user_id = $1', [userId]);
  return rows;
};

exports.getMovimientosByCuentaId = async (cuentaId) => {
  const { rows } = await pool.query('SELECT * FROM movimientos WHERE cuenta_id = $1 ORDER BY creado_en DESC', [cuentaId]);
  return rows;
};
