const { pool } = require('../config/db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto123';

exports.signIn = async (email, password) => {
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
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
