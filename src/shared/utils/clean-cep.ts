export function cleanCEP(cep: string): string {
  const cleaned = cep.replace(/\D/g, '');

  if (cleaned.length !== 8) {
    throw new Error('CEP inválido');
  }

  return cleaned; // retorna sem formatação: "85010000"
}
