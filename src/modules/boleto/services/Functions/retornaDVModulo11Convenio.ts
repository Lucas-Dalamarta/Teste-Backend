import { retornaArrayNumeros } from './retornaArrayNumeros';
import { retornaSomaTotalDoCampo } from './retornaSomaTotalDoCampo';

export function retornaDVModulo11Convenio(campo: string): number {
  const codeBarNumbers = retornaArrayNumeros(campo);

  let multiplicador = 9;  //  Vária entre intervalos de 2 - 9
  let contador = codeBarNumbers.length

  while (contador--) {
    multiplicador = multiplicador === 9 ? 2 : multiplicador + 1;

    codeBarNumbers[contador] = codeBarNumbers[contador] * multiplicador;
  }

  const totalSoma = retornaSomaTotalDoCampo(codeBarNumbers);
  const restoDaDivisao = totalSoma % 11;

  if ([0, 1].includes(restoDaDivisao)) {
    return 0;
  }

  if (restoDaDivisao === 10) {
    return 1;
  }

  const digitoVerificador = 11 - restoDaDivisao;

  return digitoVerificador;
}
