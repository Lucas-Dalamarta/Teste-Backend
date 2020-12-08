import AppError from "@shared/errors/AppError";

interface IRequest {
  barCode: string;
}

interface IResponse {
  barCode: string,
  amount: number,
  expirationDate: string
}

class ValidarBoletoService {
  constructor() {}

  public async run({ barCode }: IRequest): Promise<IResponse> {
    const isCodeValid = barCode.length === 47;

    const isCodeTooShort = barCode.length < 47;
    const isCodeTooLong = barCode.length > 47;

    if (!isCodeValid) {
      if (isCodeTooShort) {
        throw new AppError('Bar Code is too short!');
      }

      if (isCodeTooLong) {
        throw new AppError('Bar Code is too long!');
      }
    }

    const amount = parseFloat(barCode.slice(37, 47));

    const boleto = {
      barCode,
      amount,
      expirationDate: '2018-07-16',
    };

    return boleto;
  }
}

export default ValidarBoletoService

