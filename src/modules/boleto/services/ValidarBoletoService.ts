import AppError from "@shared/errors/AppError";

interface IRequest {
  typedCode: string;
}

interface IResponse {
  codeBar: string;
  amount: string;
  expirationDate: string;
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
      //  21290001192110001210904475617405975870000002000 =>  Código usado

      //  =>  Código quebrado em campos
      const campo1 = typedCode.slice(0, 10); //  2129000119
      const campo2 = typedCode.slice(10, 21); //  21100012109
      const campo3 = typedCode.slice(21, 32); //  04475617405
      const campo4 = typedCode.slice(32, 33); //  9 =>  Digito verificador do código de barras
      const campo5 = typedCode.slice(33, 47); //  7587 0000002000

      const idBanco = campo1.slice(0, 3);
      const idMoeda = campo1.slice(3, 4);
      const barraPositions20to24 = campo1.slice(4, 9);
      const digitoVerificadorCampo1 = campo1.slice(9, 10);

      const barraPositions25to34 = campo2.slice(0, 10);
      const digitoVerificadorCampo2 = campo2.slice(10, 11);

      const barraPositions35to44 = campo3.slice(0, 10);
      const digitoVerificadorCampo3 = campo3.slice(10, 11);

      const fatorVencimento = campo5.slice(0, 4);
      const barraPositions10to19 = campo5.slice(4, 14);

      //  2129000119 21100012109 04475617405 9 75870000002000

      const codeBar =
        idBanco +
        idMoeda +
        campo4 +
        fatorVencimento +
        barraPositions10to19 +
        barraPositions20to24 +
        barraPositions25to34 +
        barraPositions35to44;

      return {
        codeBar,
        amount: '20.00',
        expirationDate: '2018-07-16',
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

export default ValidarBoletoService
