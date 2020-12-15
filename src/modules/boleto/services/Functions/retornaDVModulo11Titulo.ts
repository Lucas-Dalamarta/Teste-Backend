import { retornaArrayNumeros } from "./retornaArrayNumeros";
import { retornaSomaTotalDoCampo } from "./retornaSomaTotalDoCampo";

export function retornaDVModulo11Titulo(codeBar: string): number {
  let codeBarNumbers = retornaArrayNumeros(codeBar);

  let multiplicador = 9;  //  Vária entre intervalos de 2 - 9
  let contador = codeBarNumbers.length

  while (contador--) {
    multiplicador = multiplicador === 9
      ? 2
      : multiplicador + 1

    codeBarNumbers[contador] = codeBarNumbers[contador] * multiplicador;
  }

  const totalSoma = retornaSomaTotalDoCampo(codeBarNumbers);
  const restoDaDivisao = totalSoma % 11;

  const digito = 11 - restoDaDivisao;

  return [0, 10, 11].includes(digito)
      ? 1
      : digito;
}
