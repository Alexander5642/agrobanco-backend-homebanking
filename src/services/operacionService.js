// CAPA 3 — SERVICE (Operaciones)
const operacionRepository = require('../repositories/operacionRepository');
const cuentaRepository = require('../repositories/cuentaRepository');

exports.realizarTransferencia = async (userId, cuentaOrigenId, numeroCuentaDestino, monto, descripcion) => {
  const cuentasOrigen = await cuentaRepository.getCuentasByUserId(userId);
  const cuentaOrigen = cuentasOrigen.find(c => c.id === cuentaOrigenId);

  if (!cuentaOrigen) throw new Error("Cuenta de origen no encontrada o no pertenece al usuario.");
  if (cuentaOrigen.saldo < monto) throw new Error("Fondos insuficientes.");

  const cuentaDestino = await operacionRepository.getCuentaByNumero(numeroCuentaDestino);
  if (!cuentaDestino) throw new Error("La cuenta destino no existe.");
  if (cuentaOrigen.id === cuentaDestino.id) throw new Error("No puede transferir a la misma cuenta.");

  const nuevoSaldoOrigen = parseFloat(cuentaOrigen.saldo) - parseFloat(monto);
  const nuevoSaldoDestino = parseFloat(cuentaDestino.saldo) + parseFloat(monto);

  await operacionRepository.actualizarSaldo(cuentaOrigen.id, nuevoSaldoOrigen);
  await operacionRepository.actualizarSaldo(cuentaDestino.id, nuevoSaldoDestino);

  await operacionRepository.registrarTransaccion(cuentaOrigen.id, userId, 'Transferencia Enviada', -monto, `A cuenta ${numeroCuentaDestino} - ${descripcion}`);
  await operacionRepository.registrarTransaccion(cuentaDestino.id, cuentaDestino.user_id, 'Transferencia Recibida', monto, `De cuenta ${cuentaOrigen.numero_cuenta} - ${descripcion}`);

  return { success: true, message: 'Transferencia exitosa' };
};

exports.pagarServicio = async (userId, cuentaOrigenId, monto, servicio) => {
  const cuentasOrigen = await cuentaRepository.getCuentasByUserId(userId);
  const cuentaOrigen = cuentasOrigen.find(c => c.id === cuentaOrigenId);

  if (!cuentaOrigen) throw new Error("Cuenta de origen no encontrada.");
  if (cuentaOrigen.saldo < monto) throw new Error("Fondos insuficientes.");

  const nuevoSaldoOrigen = parseFloat(cuentaOrigen.saldo) - parseFloat(monto);
  await operacionRepository.actualizarSaldo(cuentaOrigen.id, nuevoSaldoOrigen);

  await operacionRepository.registrarTransaccion(cuentaOrigen.id, userId, 'Pago de Servicio', -monto, `Pago a: ${servicio}`);
  await operacionRepository.registrarPago(userId, monto);

  return { success: true, message: 'Pago exitoso' };
};
