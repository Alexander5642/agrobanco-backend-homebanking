const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://neondb_owner:npg_EcAFR5vYjlZ9@ep-steep-night-aty4m52i.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require' });

async function seed() {
  try {
    await pool.query(`
      INSERT INTO usuarios (id, email, password, nombres, apellidos, dni, celular, direccion, rol) 
      VALUES ('usr-alexander', '74975772@continental.edu.pe', 'password123', 'Alexander', 'B.', '74975772', '999888777', 'Av. Prueba 123', 'ADMIN')
      ON CONFLICT (email) DO NOTHING;
    `);
    console.log('Usuario insertado');

    await pool.query(`
      INSERT INTO cuentas (id, user_id, numero_cuenta, saldo, trea, tem)
      VALUES ('cta-1', 'usr-alexander', '191-27865389', 1000.00, 1.5, 0.1241)
      ON CONFLICT (numero_cuenta) DO NOTHING;
    `);
    console.log('Cuenta insertada');

    await pool.query(`
      INSERT INTO tarjetas (id, user_id, cuenta_id, numero_tarjeta, fecha_expiracion, cvv, tipo, estado)
      VALUES ('tar-1', 'usr-alexander', 'cta-1', '4555 6666 7777 8888', '12/28', '123', 'DEBITO', 'ACTIVA')
      ON CONFLICT (numero_tarjeta) DO NOTHING;
    `);
    console.log('Tarjeta insertada');
    
    console.log('Semilla completada');
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
seed();
