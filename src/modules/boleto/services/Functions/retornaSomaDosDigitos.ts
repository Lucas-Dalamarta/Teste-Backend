export function retornaSomaDosDigitos(numero: number): number {
  let output = [];
  let sNumber = numero.toString();

  for (var i = 0, len = sNumber.length; i < len; i++) {
    output.push(Number(sNumber.charAt(i)));
  }

  for (var i = 0, soma = 0; i < output.length; ) {
    soma += output[i++];
  }

  return soma;
}
