export function retornaArrayNumeros(campo: string): number[] {
  //  212900011 =>  Exemplo de Entrada de dados
  //  2 1 2 9 0 0 0 1 1 =>  Dados transformados em array de Numeros
  const campoArray = campo.split('');

  let arrayNumeros = [];

  for (var i = 0; i < campoArray.length; i++) {
    arrayNumeros[i] = Number(campoArray[i]);
  }

  return arrayNumeros;
}
