const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_EcAFR5vYjlZ9@ep-steep-night-aty4m52i.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require'
});

async function migrate() {
  console.log('Iniciando migración...');
  const dbData = JSON.parse(fs.readFileSync('C:/Users/MSI/Downloads/PROYECTO-SEMANA-09, todo terminado/database/db.json', 'utf8'));

  try {
    // 1. Usuarios
    if (dbData.users) {
      console.log(`Migrando ${dbData.users.length} usuarios...`);
      for (const u of dbData.users) {
        await pool.query(`
          INSERT INTO usuarios (id, email, password, nombres, apellidos, dni, celular, direccion, rol)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (email) DO NOTHING
        `, [
          u.id, 
          u.email, 
          u.password, 
          u.nombres, 
          u.apellidos, 
          u.dni || u.id, 
          u.celular || '', 
          u.direccion || '', 
          u.rol || (u.id === 'usr-2' ? 'ADMIN' : 'CLIENTE') // Heuristica
        ]);
      }
    }

    // 2. Cuentas
    if (dbData.cuentas) {
      console.log(`Migrando ${dbData.cuentas.length} cuentas...`);
      for (const c of dbData.cuentas) {
        await pool.query(`
          INSERT INTO cuentas (id, user_id, numero_cuenta, saldo, trea, tem)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (numero_cuenta) DO NOTHING
        `, [c.id, c.user_id, c.numero_cuenta, c.saldo, c.trea, c.tem]);
      }
    }

    // 3. Tarjetas
    if (dbData.tarjetas) {
      console.log(`Migrando ${dbData.tarjetas.length} tarjetas...`);
      for (const t of dbData.tarjetas) {
        await pool.query(`
          INSERT INTO tarjetas (id, user_id, cuenta_id, numero_tarjeta, fecha_expiracion, cvv, tipo, estado)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (numero_tarjeta) DO NOTHING
        `, [t.id, t.user_id, t.cuenta_id, t.numero_tarjeta, t.fecha_expiracion, t.cvv, t.tipo, t.estado]);
      }
    }

    // 4. Movimientos
    if (dbData.movimientos) {
      console.log(`Migrando ${dbData.movimientos.length} movimientos...`);
      for (const m of dbData.movimientos) {
        try {
          await pool.query(`
            INSERT INTO movimientos (id, cuenta_id, tipo, monto, es_ingreso, creado_en)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id) DO NOTHING
          `, [m.id, m.cuenta_id, m.tipo, m.monto, m.es_ingreso, m.creado_en]);
        } catch(e) { console.error(`Error en movimiento ${m.id}:`, e.detail || e.message); }
      }
    }

    // 5. Creditos
    if (dbData.creditos) {
      console.log(`Migrando ${dbData.creditos.length} creditos...`);
      for (const c of dbData.creditos) {
        try {
          await pool.query(`
            INSERT INTO creditos (id, user_id, monto, meses, tea, cuota_mes, intereses, total, destino, estado)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT (id) DO NOTHING
          `, [c.id, c.user_id, c.monto, c.meses, c.tea, c.cuota_mes, c.intereses, c.total, c.destino || 'Libre', c.estado]);
        } catch(e) { console.error(`Error en credito ${c.id}:`, e.detail || e.message); }
      }
    }

    // 6. Pagos
    if (dbData.pagos) {
      console.log(`Migrando ${dbData.pagos.length} pagos...`);
      for (const p of dbData.pagos) {
        try {
          await pool.query(`
            INSERT INTO pagos (id, user_id, cuenta_id, servicio, monto, codigo_pago)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id) DO NOTHING
          `, [p.id, p.user_id, p.cuenta_id, p.servicio, p.monto, p.codigo_pago]);
        } catch(e) { console.error(`Error en pago ${p.id}:`, e.detail || e.message); }
      }
    }

    // 7. Solicitudes Publicas
    if (dbData.solicitudes_publicas) {
      console.log(`Migrando ${dbData.solicitudes_publicas.length} solicitudes...`);
      for (const s of dbData.solicitudes_publicas) {
        try {
          await pool.query(`
            INSERT INTO solicitudes_publicas (id, tipo, nombres, documento, telefono, email, mensaje, estado)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (id) DO NOTHING
          `, [s.id, s.tipo, s.nombres, s.documento, s.telefono, s.email, s.mensaje, s.estado]);
        } catch(e) { console.error(`Error en solicitud ${s.id}:`, e.detail || e.message); }
      }
    }

    console.log('¡Migración de datos completada exitosamente!');
  } catch(e) {
    console.error('Error migrando datos:', e);
  } finally {
    pool.end();
  }
}

migrate();
