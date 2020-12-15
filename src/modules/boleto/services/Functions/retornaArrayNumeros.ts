export function retornaArrayNumeros(campo: string): number[] {
  const campoArray = campo.split('');

  let arrayNumeros = [];
  for (var i = 0; i < campoArray.length; i++) {
    arrayNumeros[i] = Number(campoArray[i]);
  }

  return arrayNumeros;
}
