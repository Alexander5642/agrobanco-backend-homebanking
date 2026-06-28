const { pool } = require('../config/db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto123';

exports.signIn = async (identifier, password) => {
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1 OR dni = $1', [identifier]);
  if (rows.length === 0) throw new Error('Credenciales incorrectas. Inténtalo nuevamente.');
  
  const user = rows[0];
  if (user.password !== password) throw new Error('Credenciales incorrectas. Inténtalo nuevamente.');
  
  const token = jwt.sign({ id: user.id, email: user.email, rol: user.rol }, JWT_SECRET, { expiresIn: '1d' });
  
  return { 
    user: { id: user.id, email: user.email, role: user.rol, user_metadata: { nombres: user.nombres, apellidos: user.apellidos, dni: user.dni } },
    session: { access_token: token }
  };
};

exports.signOut = async () => {
  // Sin estado en el lado del servidor para JWT simples
  return true;
};

exports.getUser = async (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE id = $1', [decoded.id]);
    if (rows.length === 0) throw new Error('Usuario no encontrado');
    const user = rows[0];
    return { user: { id: user.id, email: user.email, role: user.rol, user_metadata: { nombres: user.nombres, apellidos: user.apellidos, dni: user.dni } } };
  } catch (error) {
    throw new Error('Token inválido o expirado.');
  }
};

exports.signUp = async (userData) => {
  // Check if user exists
  const { rows: existing } = await pool.query('SELECT * FROM usuarios WHERE email = $1 OR dni = $2', [userData.email, userData.dni]);
  if (existing.length > 0) throw new Error('El correo electrónico o DNI ya están registrados.');

  const userId = 'usr-' + Date.now();
  const cuentaId = 'cta-' + Date.now();
  
  // Random account number
  const numCuenta = '191-' + Math.floor(10000000 + Math.random() * 90000000);

  // Insert user
  await pool.query(
    'INSERT INTO usuarios (id, email, password, nombres, apellidos, dni, celular, direccion, rol) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
    [userId, userData.email, userData.password, userData.nombres, userData.apellidos, userData.dni, userData.celular, userData.direccion, 'CLIENTE']
  );

  // Insert account
  await pool.query(
    'INSERT INTO cuentas (id, user_id, numero_cuenta, saldo, trea, tem) VALUES ($1, $2, $3, $4, $5, $6)',
    [cuentaId, userId, numCuenta, 0.00, 1.5, 0.1241]
  );

  // Return same format as signIn
  return exports.signIn(userData.email, userData.password);
};
