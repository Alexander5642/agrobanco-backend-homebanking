// CAPA 3 — SERVICE (Cuentas)
const cuentaRepository = require('../repositories/cuentaRepository');

exports.getResumenCuentas = async (userId) => {
  const cuentas = await cuentaRepository.getCuentasByUserId(userId) || [];
  const tarjetas = await cuentaRepository.getTarjetasByUserId(userId) || [];
  
  for (let cuenta of cuentas) {
    cuenta.movimientos = await cuentaRepository.getMovimientosByCuentaId(cuenta.id) || [];
  }

  return { cuentas, tarjetas };
};
