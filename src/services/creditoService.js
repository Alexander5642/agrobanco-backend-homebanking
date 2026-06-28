// CAPA 3 — SERVICE (Creditos)
const creditoRepository = require('../repositories/creditoRepository');

exports.getCreditosUsuario = async (userId) => {
  const creditos = await creditoRepository.getCreditosByUserId(userId) || [];
  
  for (let credito of creditos) {
    credito.cuotas = await creditoRepository.getCuotasByCreditoId(credito.id) || [];
  }

  return creditos;
};
