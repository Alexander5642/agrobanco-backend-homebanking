const { pool } = require('../config/db');

exports.getCreditosByUserId = async (userId) => {
  const { rows } = await pool.query('SELECT * FROM creditos WHERE user_id = $1', [userId]);
  return rows;
};

exports.getCuotasByCreditoId = async (creditoId) => {
  // Simplificado temporalmente, ya que no agregamos tabla de cuotas en el schema base
  // pero mantendremos la función para no romper el servicio si es llamado.
  return [];
};
