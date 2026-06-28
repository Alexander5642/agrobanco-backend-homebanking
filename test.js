const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://neondb_owner:npg_EcAFR5vYjlZ9@ep-steep-night-aty4m52i.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require' });

async function test() {
  try {
    const cuentas = await pool.query('SELECT * FROM cuentas WHERE user_id = $1', ['usr-alexander']);
    const movimientos = await pool.query('SELECT * FROM movimientos WHERE cuenta_id = $1', [cuentas.rows[0].id]);
    console.log('Movimientos:', movimientos.rows);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    pool.end();
  }
}
test();
