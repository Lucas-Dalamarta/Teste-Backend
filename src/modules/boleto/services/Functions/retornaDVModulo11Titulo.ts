import { retornaSomaTotalDoCampo } from "./retornaSomaTotalDoCampo";

export function retornaDVModulo11Titulo(codeBar: string): number {
  //  V =>  21299758700000020000001121100012100447561740
  //  SV  =>  2129758700000020000001121100012100447561740;

  const codeBarSplitted = codeBar.split('');
  let codeBarNumbers = [];

  for (let i = 0; i < codeBarSplitted.length; i++) {
    codeBarNumbers[i] = parseInt(codeBarSplitted[i]);
  } // [2,1,2,9,7,5,8,7,0,0,0,0,0,0,2,0,0,0,0,0,0,1,1,2,1,1,0,0,0,1,2,1,0,0,4,4,7,5,6,1,7,4,0];

  let multiplicador = 9;  //  Vária entre intervalos de 2 - 9
  let contador = codeBarNumbers.length

  while (contador--) {
    multiplicador = multiplicador === 9
      ? multiplicador = 2
      : multiplicador = multiplicador + 1

    codeBarNumbers[contador] = codeBarNumbers[contador] * multiplicador;
  }

  const totalSoma = retornaSomaTotalDoCampo(codeBarNumbers);
  const restoDaDivisao = totalSoma % 11;

  const digito = 11 - restoDaDivisao;

  const digitoVerificador =
    [0, 10, 11].includes(digito)
      ? 1
      : digito

  return digitoVerificador;
}
