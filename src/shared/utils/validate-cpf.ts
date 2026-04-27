import { BadRequestError } from '@/shared/errors/bad-request-error';

export function isValidCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, '');

  if (cleaned.length !== 11) {
    throw new BadRequestError('CPF inválido');
  }

  // Rejeita sequências iguais (ex: 111.111.111-11)
  if (/^(\d)\1+$/.test(cleaned)) {
    throw new BadRequestError('CPF inválido');
  }

  // Valida primeiro dígito
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned[9])) {
    throw new BadRequestError('CPF inválido');
  }

  // Valida segundo dígito
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned[10])) {
    throw new BadRequestError('CPF inválido');
  }

  return cleaned; // retorna sem formatação: "12345678909"
}
