require('dotenv').config();
const { pool } = require('./src/config/db');

async function run() {
  try {
    console.log("Modificando tabla creditos...");

    // 1. Eliminar la restricción CHECK de estado si existe
    // En Postgres, necesitamos encontrar el nombre de la restricción primero
    const checkQuery = `
      SELECT conname 
      FROM pg_constraint 
      WHERE conrelid = 'creditos'::regclass 
        AND contype = 'c' 
        AND pg_get_constraintdef(oid) ILIKE '%estado%';
    `;
    const checkRes = await pool.query(checkQuery);
    
    for (const row of checkRes.rows) {
      await pool.query(`ALTER TABLE creditos DROP CONSTRAINT ${row.conname}`);
      console.log(`Constraint ${row.conname} eliminada.`);
    }

    // 2. Añadir nuevas columnas
    const alterQuery = `
      ALTER TABLE creditos
      ADD COLUMN IF NOT EXISTS tipo_credito VARCHAR(100),
      ADD COLUMN IF NOT EXISTS frecuencia_pago VARCHAR(50),
      ADD COLUMN IF NOT EXISTS hectareas INT,
      ADD COLUMN IF NOT EXISTS cabezas_ganado INT,
      ADD COLUMN IF NOT EXISTS ingreso_anual_uit NUMERIC(10,2)
    `;
    await pool.query(alterQuery);
    console.log("Nuevas columnas añadidas exitosamente.");

    // Opcional: Actualizar registros existentes para evitar nulls en columnas críticas
    await pool.query(`UPDATE creditos SET tipo_credito = 'Crédito Tradicional' WHERE tipo_credito IS NULL`);
    await pool.query(`UPDATE creditos SET frecuencia_pago = 'Mensual' WHERE frecuencia_pago IS NULL`);
    
    console.log("Actualización finalizada.");
  } catch (error) {
    console.error("Error alterando tabla:", error);
  } finally {
    pool.end();
  }
}

run();
