export function retornaSomaTotalDoCampo(numeros: number[]): number {
  let soma = 0;

  for (var t = 0; t < numeros.length; t++) {
    soma += numeros[t];
  }

  return soma;
}
