const { pool } = require('./src/config/db');
async function run() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contactos (
      id VARCHAR(50) PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      telefono VARCHAR(20) NOT NULL,
      email VARCHAR(100) NOT NULL,
      mensaje TEXT,
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('Tabla contactos creada');
  process.exit(0);
}
run();
