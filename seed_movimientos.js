const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://neondb_owner:npg_EcAFR5vYjlZ9@ep-steep-night-aty4m52i.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require' });

async function seedMovimientos() {
  try {
    // Current date for "Este mes"
    const now = new Date();
    
    // Past month for "Mes pasado"
    const pastMonthDate = new Date();
    pastMonthDate.setMonth(now.getMonth() - 1);
    
    // Insert some incomes and expenses
    await pool.query(`
      INSERT INTO movimientos (id, cuenta_id, tipo, monto, es_ingreso, creado_en)
      VALUES 
      ('mov-1', 'cta-1', 'Depósito en Efectivo', 1500.00, true, $1),
      ('mov-2', 'cta-1', 'Pago de Servicios', 120.50, false, $2),
      ('mov-3', 'cta-1', 'Transferencia Recibida', 300.00, true, $3),
      ('mov-4', 'cta-1', 'Retiro en Cajero', 200.00, false, $4),
      ('mov-5', 'cta-1', 'Pago de Crédito', 100.95, false, $5)
      ON CONFLICT DO NOTHING;
    `, [
      now.toISOString(),
      now.toISOString(),
      pastMonthDate.toISOString(),
      pastMonthDate.toISOString(),
      now.toISOString()
    ]);
    
    console.log('Movimientos insertados con exito!');
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

seedMovimientos();
