const { pool } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.getCuentaByNumero = async (numeroCuenta) => {
  const { rows } = await pool.query('SELECT * FROM cuentas WHERE numero_cuenta = $1', [numeroCuenta]);
  return rows[0] || null;
};

exports.actualizarSaldo = async (cuentaId, nuevoSaldo) => {
  const { rows } = await pool.query('UPDATE cuentas SET saldo = $1 WHERE id = $2 RETURNING *', [nuevoSaldo, cuentaId]);
  return rows[0];
};

exports.registrarTransaccion = async (cuentaId, userId, tipoTransaccion, monto, descripcion) => {
  const id = uuidv4();
  // Asumimos que los pagos/transferencias que salen de la cuenta son egresos (es_ingreso = false)
  const esIngreso = tipoTransaccion.toLowerCase().includes('abono') || tipoTransaccion.toLowerCase().includes('ingreso');
  
  const { rows } = await pool.query(
    'INSERT INTO movimientos (id, cuenta_id, tipo, monto, es_ingreso) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [id, cuentaId, tipoTransaccion, monto, esIngreso]
  );
  return rows[0];
};

exports.registrarPago = async (userId, monto) => {
  const id = uuidv4();
  // Requeriría cuenta_id según nuestro nuevo schema, pero pasaremos NULL por simplicidad temporal
  const { rows } = await pool.query(
    'INSERT INTO pagos (id, user_id, servicio, monto) VALUES ($1, $2, $3, $4) RETURNING *',
    [id, userId, 'Pago de Servicio General', monto]
  );
  return rows[0];
};
