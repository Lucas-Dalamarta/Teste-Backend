import { format, addDays } from 'date-fns';

import AppError from '@shared/errors/AppError';
import { retornaDigitoVerificadorValidado } from './Functions/retornaDigitoVerificadorValidado';
import { retornaUltimoDigitoValidado } from './Functions/retornaUltimoDigitoValidado';

interface IRequest {
  typedCode: string;
}

interface IResponse {
  codeBar: string;
  amount?: string;
  expirationDate?: string;
}

class ValidarBoletoService {
  constructor() {}

  public async run({ typedCode }: IRequest): Promise<IResponse | undefined> {
    const acceptedCodeLenghts = [47, 48]; //  =>  Título / Convênio

    const isValid =
      acceptedCodeLenghts.includes(typedCode.length) && //  Verifica se o tamanho do código está entre os tamanhos aceitáveis
      typedCode.match(/^[0-9]+$/) != null; //  Verifica se só existem números na string

    if (!isValid) {
      let errorMessage = '';

      if (typedCode.match(/^[0-9]+$/) === null) {
        errorMessage = `Code can't contain letters or special characters`;
      }

      if (typedCode.length < acceptedCodeLenghts[0]) {
        // Confere o menor valor possível
        errorMessage = `Code is too short`;
      }

      if (typedCode.length > acceptedCodeLenghts[1]) {
        // Confere o maior valor possível
        errorMessage = 'Code is too long';
      }

      throw new AppError(errorMessage);
    }

    const tipoBoleto = typedCode.length === 47 ? 'TITULO' : 'CONVENIO';

    if (tipoBoleto === 'TITULO') {
      //  21290001192110001210904475617405975870000002000 =>  Código usado como base

      //  =>  Código quebrado em campos

      const campos = {
        campo1: typedCode.slice(0, 10), //  2129000119
        campo2: typedCode.slice(10, 21), //  21100012109
        campo3: typedCode.slice(21, 32), //  04475617405
        campo4: typedCode.slice(32, 33), //  9
        campo5: typedCode.slice(33, 47), //  7587 0000002000
      };

      const digitosVerificadores = {
        digito1: parseInt(campos.campo1.slice(9, 10)), //  9
        digito2: parseInt(campos.campo2.slice(10, 11)), //  9
        digito3: parseInt(campos.campo3.slice(10, 11)), //  5
        digito4: parseInt(campos.campo4), //  9
      };

      const composicaoDoCodigoDeBarras = {
        pos10to19: campos.campo5.slice(4, 14),
        pos20to24: campos.campo1.slice(4, 9),
        pos25to34: campos.campo2.slice(0, 10),
        pos35to44: campos.campo3.slice(0, 10),
      };

      const idBanco = campos.campo1.slice(0, 3);
      const idMoeda = campos.campo1.slice(3, 4);
      const fatorVencimento = campos.campo5.slice(0, 4);

      const codeBarNaoValidado =
        idBanco +
        idMoeda +
        // digitosValidados.digito4 +
        // digitosVerificadores.digito4 +
        fatorVencimento +
        composicaoDoCodigoDeBarras.pos10to19 +
        composicaoDoCodigoDeBarras.pos20to24 +
        composicaoDoCodigoDeBarras.pos25to34 +
        composicaoDoCodigoDeBarras.pos35to44;

      const digitosValidados = {
        digito1: retornaDigitoVerificadorValidado(campos.campo1.slice(0, 9)), //  2129000112
        digito2: retornaDigitoVerificadorValidado(campos.campo2.slice(0, 10)), //  21100012109
        digito3: retornaDigitoVerificadorValidado(campos.campo3.slice(0, 10)), //  04475617405
        digito4: retornaUltimoDigitoValidado(codeBarNaoValidado),
      };

      if (digitosValidados.digito1 !== digitosVerificadores.digito1) {
        throw new AppError(
          `DV do campo 1 está incorreto! O DV esperado é ${digitosValidados.digito1}, DV recebido é ${digitosVerificadores.digito1}`,
        );
      }

      if (digitosValidados.digito2 !== digitosVerificadores.digito2) {
        throw new AppError(
          `DV do campo 2 está incorreto! O DV esperado é ${digitosValidados.digito2}, DV recebido é ${digitosVerificadores.digito2}`,
        );
      }

      if (digitosValidados.digito3 !== digitosVerificadores.digito3) {
        throw new AppError(
          `DV do campo 3 está incorreto! O DV esperado é ${digitosValidados.digito3}, DV recebido é ${digitosVerificadores.digito3}`,
        );
      }

      if (digitosValidados.digito4 !== digitosVerificadores.digito4) {
        throw new AppError(
          `DV do campo 4 está incorreto! O DV esperado é ${digitosValidados.digito4}, DV recebido é ${digitosVerificadores.digito4}`,
        );
      }

      //  2129758700000020000001121100012100447561740

      const codeBarValidado =
        idBanco +
        idMoeda +
        digitosValidados.digito4 +
        fatorVencimento +
        composicaoDoCodigoDeBarras.pos10to19 +
        composicaoDoCodigoDeBarras.pos20to24 +
        composicaoDoCodigoDeBarras.pos25to34 +
        composicaoDoCodigoDeBarras.pos35to44;

      const valorBoleto = (
        parseFloat(campos.campo5.slice(4, 14)) / 100
      ).toFixed(2);

      const amount = valorBoleto !== '0.00' ? valorBoleto : undefined;

      const expirationDate =
        fatorVencimento !== '0000'
          ? format(
              addDays(new Date(1997, 9, 7), parseInt(fatorVencimento)),
              'yyyy-MM-dd',
            ).toString()
          : undefined;

      return {
        codeBar: codeBarValidado,
        amount,
        expirationDate,
      };
    } else if (tipoBoleto === 'CONVENIO') {
      const codeBar = typedCode;

      return {
        codeBar,
        amount: '20.00',
        expirationDate: '2018-07-16',
      };
    }
  }
}

export default ValidarBoletoService;

//  ==> Digitos verificadores inválidos
//  1     =>  21290001102110001210904475617405975870000002000
//  2     =>  21290001192110001210104475617405975870000002000
//  3     =>  21290001192110001210904475617402975870000002000
//  4     =>  21290001192110001210904475617405275870000002000
//  All   =>  21290001132110001210204475617405975870000002000

//  2129758700000020000001121100012100447561740
//  21299758700000020000001121100012100447561740
//  Teste =>  21290001192110001210904475617405975870000002000
//  Campos =>  2129000113 21100012102 04475617405 9 75870000002000
