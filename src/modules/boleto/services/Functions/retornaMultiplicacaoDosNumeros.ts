import { retornaSomaDosDigitos } from './retornaSomaDosDigitos';

export function retornaMultiplicacaoDosNumeros(numeros: number[]): number[] {
  let multiplicador = 1;
  for (var i = numeros.length - 1; i >= 0; i--) {
    multiplicador = multiplicador === 1 ? 2 : 1
    numeros[i] = retornaSomaDosDigitos(numeros[i] * multiplicador);
  }

  return numeros;
}
