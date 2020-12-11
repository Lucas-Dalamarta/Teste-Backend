import { format, addDays } from 'date-fns';

import AppError from '@shared/errors/AppError';

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
        digito1: campos.campo1.slice(9, 10), //  9
        digito2: campos.campo2.slice(10, 11), //  9
        digito3: campos.campo3.slice(10, 11), //  5
        digito4: campos.campo4, //  9
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

      //  Calcula data de vencimento
      const dataBase = new Date(1997, 9, 7); // =>  1997/10/07

      const expirationDate =
        fatorVencimento !== '0000'
          ? format(
              addDays(dataBase, parseInt(fatorVencimento)),
              'yyyy-MM-dd',
            ).toString()
          : undefined;

      const codeBar =
        idBanco +
        idMoeda +
        digitosVerificadores.digito4 +
        fatorVencimento +
        composicaoDoCodigoDeBarras.pos10to19 +
        composicaoDoCodigoDeBarras.pos20to24 +
        composicaoDoCodigoDeBarras.pos25to34 +
        composicaoDoCodigoDeBarras.pos35to44;

      return {
        codeBar,
        amount: '20.00',
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
