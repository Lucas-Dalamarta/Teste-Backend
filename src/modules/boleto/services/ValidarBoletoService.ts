import AppError from "@shared/errors/AppError";

interface IRequest {
  typedCode: string;
}

interface IResponse {
  codeBar: string;
  amount: string;
  expirationDate: string;
  length: number;
}

class ValidarBoletoService {
  constructor() {}

  public async run({ typedCode }: IRequest): Promise<IResponse> {
    const acceptedCodeLenghts = [47, 48];   //  =>  Título / Convênio (Presumindo-se que os valores estarão sempre em ordem crescente)

    const isValid = (
      acceptedCodeLenghts.includes(typedCode.length) && //  Verifica se o tamanho do código está entre os tamanhos aceitáveis
      typedCode.match(/^[0-9]+$/) != null //  Verifica se só existem números na string
    );

    if (!isValid) {
      let errorMessage = '';

      if (typedCode.match(/^[0-9]+$/) === null) {
        errorMessage = `Code can't contain letters or special characters`;
      }

      if (typedCode.length < acceptedCodeLenghts[0]) {
        // Confere o menor valor possível
        errorMessage = `Code is too short`;
      }

      if (typedCode.length > acceptedCodeLenghts[acceptedCodeLenghts.length - 1]) {
        // Confere o maior valor possível
        errorMessage = 'Code is too long';
      }

      throw new AppError(errorMessage);
    }

    const boleto = {
      codeBar: typedCode,
      amount: '20.00',
      expirationDate: '2018-07-16',
    };

    return boleto;
  }
}

export default ValidarBoletoService

//  836000000015460201103138834403604020100240230860 - Convênio
//  848800000027548301622023012101193681585024111229 - Convênio
//  111111111111222222222222333333333333444444444444

//  21290001192110001210904475617405975870000002000 - (47) - Enviado na URL
//  21299758700000020000001121100012100447561740 - (44) - Teste
//  11111111112222222222233333333333455555555555555


// 21290001192110001210904475617405975870000002000

//   “barCode”: “21299758700000020000001121100012100447561740”,
//   “amount”: “20.00”,
//   “expirationDate”: “2018 - 07 - 16”
