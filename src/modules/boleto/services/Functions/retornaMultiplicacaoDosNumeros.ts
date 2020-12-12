import { retornaSomaDosDigitos } from './retornaSomaDosDigitos';

export function retornaMultiplicacaoDosNumeros(numeros: number[]): number[] {
  for (var i = numeros.length - 1; i >= 0; i--) {
    if (numeros.length % 2 !== 0) {
      numeros[i] = i % 2 === 0 ? numeros[i] * 2 : numeros[i] * 1; //  Caso o array seja de tamanho par
    } else {
      numeros[i] = i % 2 === 0 ? numeros[i] * 1 : numeros[i] * 2; //  Caso o array seja de tamanho impar
    }
  } //  =>  Multiplica o numero

  for (var j = 0; j < numeros.length; j++) {
    numeros[j] = retornaSomaDosDigitos(numeros[j]); //  =>  Retorna o produto dos digitos do numero caso ele seja maior que 9
  }

  return numeros;
}
