import { retornaArrayNumeros } from "./retornaArrayNumeros";
import { retornaMultiplicacaoDosNumeros } from "./retornaMultiplicacaoDosNumeros";
import { retornaSomaTotalDoCampo } from './retornaSomaTotalDoCampo';

export function retornaDVModulo10(campo: string): number {
  const arrayDeNumeros = retornaArrayNumeros(campo);
  const numerosMultiplicados = retornaMultiplicacaoDosNumeros(arrayDeNumeros);
  const somaTotalDoCampo = retornaSomaTotalDoCampo(numerosMultiplicados);

  const restoDaDivisao = somaTotalDoCampo % 10;
  const dezenaSuperior = (Math.floor(somaTotalDoCampo / 10) + 1) * 10; //  Remove o valor da unidade e gera a proxima dezena
  const digitoVerificador = (dezenaSuperior - restoDaDivisao) % 10;

  return digitoVerificador;
}
