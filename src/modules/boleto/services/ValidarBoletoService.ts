import { format, addDays } from 'date-fns';

import AppError from '@shared/errors/AppError';
import { retornaDVModulo10 } from './Functions/retornaDVModulo10';
import { retornaDVModulo11Titulo } from './Functions/retornaDVModulo11Titulo';
import { retornaDVModulo11Convenio } from './Functions/retornaDVModulo11Convenio';

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

    if (typedCode.length === 48 && Number(typedCode[0]) !== 8) {
      //  Verifica se o código é de Convênio, e se ele inicia-se com 8
      throw new AppError('Código de Identificação do Produto é inválido');
    }

    if (!isValid) {
      let errorMessage = '';

      if (typedCode.match(/^[0-9]+$/) === null) {
        errorMessage = `O Código não pode conter letras ou caracteres especiais`;
      }

      if (typedCode.length < acceptedCodeLenghts[0]) {
        // Confere o menor valor possível
        errorMessage = `O Código inserido está com digitos a menos do que o esperado`;
      }

      if (typedCode.length > acceptedCodeLenghts[1]) {
        // Confere o maior valor possível
        errorMessage =
          'O Código inserido está com digitos a mais do que o esperado';
      }

      throw new AppError(errorMessage);
    }

    const tipoBoleto = typedCode.length === 47 ? 'TITULO' : 'CONVENIO';

    if (tipoBoleto === 'TITULO') {
      const campos = {
        campo1: typedCode.slice(0, 10),
        campo2: typedCode.slice(10, 21),
        campo3: typedCode.slice(21, 32),
        campo4: typedCode.slice(32, 33),
        campo5: typedCode.slice(33, 47),
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
        fatorVencimento +
        composicaoDoCodigoDeBarras.pos10to19 +
        composicaoDoCodigoDeBarras.pos20to24 +
        composicaoDoCodigoDeBarras.pos25to34 +
        composicaoDoCodigoDeBarras.pos35to44;

      const digitosValidados = {
        digito1: retornaDVModulo10(campos.campo1.slice(0, 9)),
        digito2: retornaDVModulo10(campos.campo2.slice(0, 10)),
        digito3: retornaDVModulo10(campos.campo3.slice(0, 10)),
        digito4: retornaDVModulo11Titulo(codeBarNaoValidado),
      };

      const digitosVerificadores = {
        digito1: Number(campos.campo1.slice(9, 10)),
        digito2: Number(campos.campo2.slice(10, 11)),
        digito3: Number(campos.campo3.slice(10, 11)),
        digito4: Number(campos.campo4),
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
              addDays(new Date(1997, 9, 7), Number(fatorVencimento)),
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
        campo1: campos.campo1.slice(0, 11),
        campo2: campos.campo2.slice(0, 11),
        campo3: campos.campo3.slice(0, 11),
        campo4: campos.campo4.slice(0, 11),
      };

      const idValorEfetivoOeReferencia = Number(campos.campo1.slice(2, 3));

      if (![6, 7, 8, 9].includes(idValorEfetivoOeReferencia)) {
        throw new AppError(
          'Identificador de Valor Efetivo ou Referência é inválido',
        );
      }

      const modulo = [6, 7].includes(idValorEfetivoOeReferencia) ? 10 : 11;

      const codeBarNaoValidado =
        camposSemDV.campo1.slice(0, 3) +
        camposSemDV.campo1.slice(4, 12) +
        camposSemDV.campo2 +
        camposSemDV.campo3 +
        camposSemDV.campo4;

      const digitosVerificadores = {
        digito1: Number(campos.campo1.slice(11, 12)),
        digito2: Number(campos.campo2.slice(11, 12)),
        digito3: Number(campos.campo3.slice(11, 12)),
        digito4: Number(campos.campo4.slice(11, 12)),
        digitoGeral: Number(campos.campo1.slice(3, 4)),
      };

      const digitosValidados = {
        digito1:
          modulo === 10
            ? retornaDVModulo10(campos.campo1.slice(0, 11))
            : retornaDVModulo11Convenio(campos.campo1.slice(0, 11)),
        digito2:
          modulo === 10
            ? retornaDVModulo10(campos.campo2.slice(0, 11))
            : retornaDVModulo11Convenio(campos.campo2.slice(0, 11)),
        digito3:
          modulo === 10
            ? retornaDVModulo10(campos.campo3.slice(0, 11))
            : retornaDVModulo11Convenio(campos.campo3.slice(0, 11)),
        digito4:
          modulo === 10
            ? retornaDVModulo10(campos.campo4.slice(0, 11))
            : retornaDVModulo11Convenio(campos.campo4.slice(0, 11)),
        digitoGeral:
          modulo === 10
            ? retornaDVModulo10(codeBarNaoValidado)
            : retornaDVModulo11Convenio(codeBarNaoValidado),
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

      if (digitosValidados.digitoGeral !== digitosVerificadores.digitoGeral) {
        throw new AppError(
          `DV Geral está incorreto! O DV esperado é ${digitosValidados.digitoGeral}, DV recebido é ${digitosVerificadores.digitoGeral}`,
        );
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
      };
    }
  }
}

export default ValidarBoletoService;
