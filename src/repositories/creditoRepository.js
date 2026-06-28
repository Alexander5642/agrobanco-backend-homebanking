const { pool } = require('../config/db');

exports.getCreditosByUserId = async (userId) => {
  const { rows } = await pool.query('SELECT * FROM creditos WHERE user_id = $1 ORDER BY creado_en DESC', [userId]);
  return rows;
};

exports.getAllCreditos = async () => {
  const query = `
    SELECT c.*, u.nombres as user_name, u.apellidos as user_lastname, u.dni as user_dni 
    FROM creditos c
    JOIN usuarios u ON c.user_id = u.id
    ORDER BY c.creado_en DESC
  `;
  const { rows } = await pool.query(query);
  return rows;
};

exports.createCredito = async (creditoData) => {
  const { 
    id, user_id, monto, meses, tea, cuota_mes, intereses, total, destino, estado,
    tipo_credito, frecuencia_pago, hectareas, cabezas_ganado, ingreso_anual_uit
  } = creditoData;

  const query = `
    INSERT INTO creditos 
    (id, user_id, monto, meses, tea, cuota_mes, intereses, total, destino, estado, tipo_credito, frecuencia_pago, hectareas, cabezas_ganado, ingreso_anual_uit)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING *;
  `;
  const values = [
    id, user_id, monto, meses, tea, cuota_mes, intereses, total, destino, estado,
    tipo_credito, frecuencia_pago, hectareas, cabezas_ganado, ingreso_anual_uit
  ];
  
  const { rows } = await pool.query(query, values);
  return rows[0];
};

exports.updateCreditoEstado = async (id, estado) => {
  const { rows } = await pool.query('UPDATE creditos SET estado = $1 WHERE id = $2 RETURNING *', [estado, id]);
  return rows[0];
};

exports.getCuotasByCreditoId = async (creditoId) => {
  return [];
};
