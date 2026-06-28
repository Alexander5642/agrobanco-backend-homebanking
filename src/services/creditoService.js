// CAPA 3 — SERVICE (Creditos)
const creditoRepository = require('../repositories/creditoRepository');
const { v4: uuidv4 } = require('uuid');

exports.getCreditosUsuario = async (userId) => {
  const creditos = await creditoRepository.getCreditosByUserId(userId) || [];
  for (let credito of creditos) {
    credito.cuotas = await creditoRepository.getCuotasByCreditoId(credito.id) || [];
  }
  return creditos;
};

exports.getAllCreditos = async () => {
  return await creditoRepository.getAllCreditos();
};

exports.updateCreditoEstado = async (id, estado) => {
  return await creditoRepository.updateCreditoEstado(id, estado);
};

exports.solicitarCredito = async (userId, data) => {
  // data incluye: monto, meses, tipo_credito, frecuencia_pago, hectareas, cabezas_ganado, ingreso_anual_uit
  const { monto, meses, tipo_credito, frecuencia_pago, hectareas, cabezas_ganado, ingreso_anual_uit } = data;
  
  if (monto < 1000) throw new Error("Monto mínimo S/ 1000");

  let tea = 40.92; // Default TEA
  if (tipo_credito === 'Fondo Agroperú') tea = 3.5;
  if (tipo_credito === 'Crédito Pecuario') tea = 12.5;
  if (tipo_credito === 'Crédito Agrícola Tradicional') tea = 15.0;

  // Calculo de cuota base
  const m = parseFloat(monto) || 0;
  const mesesInt = parseInt(meses || '1');
  const tem = Math.pow(1 + (tea / 100), 1 / 12) - 1;
  let cuota_mes = 0;
  let total = 0;
  let intereses = 0;

  if (frecuencia_pago === 'Al Vencimiento (Cosecha)') {
    // Interés simple o compuesto por los meses, se paga todo al final
    total = m * Math.pow(1 + tem, mesesInt);
    intereses = total - m;
    cuota_mes = total; // Una sola cuota final
  } else {
    // Cuotas mensuales fijas
    cuota_mes = m > 0 ? m * ((tem * Math.pow(1 + tem, mesesInt)) / (Math.pow(1 + tem, mesesInt) - 1)) : 0;
    total = cuota_mes * mesesInt;
    intereses = total - m;
  }

  const newCredito = {
    id: `sol-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    user_id: userId,
    monto,
    meses: mesesInt,
    tea,
    cuota_mes,
    intereses,
    total,
    destino: tipo_credito,
    estado: 'PENDIENTE',
    tipo_credito: tipo_credito || 'General',
    frecuencia_pago: frecuencia_pago || 'Mensual',
    hectareas: hectareas ? parseInt(hectareas) : null,
    cabezas_ganado: cabezas_ganado ? parseInt(cabezas_ganado) : null,
    ingreso_anual_uit: ingreso_anual_uit ? parseFloat(ingreso_anual_uit) : null
  };

  return await creditoRepository.createCredito(newCredito);
};
