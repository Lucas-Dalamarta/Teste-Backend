import { format, addDays } from 'date-fns';

import AppError from '@shared/errors/AppError';
import { retornaDVModulo10 } from './Functions/retornaDigitoVerificadorValidado';
import { retornaDVModulo11 } from './Functions/retornaUltimoDigitoValidado';
import { ca } from 'date-fns/locale';

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
        digito1: retornaDVModulo10(campos.campo1.slice(0, 9)), //  2129000112
        digito2: retornaDVModulo10(campos.campo2.slice(0, 10)), //  21100012109
        digito3: retornaDVModulo10(campos.campo3.slice(0, 10)), //  04475617405
        digito4: retornaDVModulo11(codeBarNaoValidado),
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
      const campos = {
        campo1: typedCode.slice(0, 12),
        campo2: typedCode.slice(12, 24),
        campo3: typedCode.slice(24, 36),
        campo4: typedCode.slice(36, 48),
      };

      const camposSemDV = {
        campo1: campos.campo1.slice(0,11),
        campo2:campos.campo2.slice(0,11),
        campo3:campos.campo3.slice(0,11),
        campo4:campos.campo4.slice(0,11)
      }

      const codeBar =
        camposSemDV.campo1 +
        camposSemDV.campo2 +
        camposSemDV.campo3 +
        camposSemDV.campo4;

      const valorBoleto = (
        parseFloat(
          camposSemDV.campo1.slice(4, 12) + camposSemDV.campo2.slice(0, 4),
        ) / 100
      ).toFixed(2);

      const amount = valorBoleto !== '0.00' ? valorBoleto : undefined;

      return {
        codeBar,
        amount,
        expirationDate: '2018-07-16',
      };
    }
  }
}

export default ValidarBoletoService;

//  =>  Título
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

//  21290001192110001210904475617405975870000002000

//  =>  Convênio
//  848800000027548301622023012101193681585024111229
//  817700000000010936599702411310797039001433708318


//  846700000017435900240209024050002435842210108119
//  84670000001435900240200240500024384221010811

//  84670000001435900240200240500024384221010811


//  836000000015 460201103138 834403604020 100240230860

//  858900000204000003281833240720183105618666712531
//  85890000020000003281832407201831061866671253

//  85890000020 00000328183 2407 2018310 61866671253

//  00000 20000.00


//  00000 200000;
