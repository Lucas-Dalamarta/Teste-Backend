import AppError from "@shared/errors/AppError";

interface IRequest {
  barCode: string;
}

interface IResponse {
  barCode: string,
  amount: string,
  expirationDate: string
}

class ValidarBoletoService {
  constructor() {}

  public async run({ barCode }: IRequest): Promise<IResponse> {
    const isCodeValid = (barCode.length === (47 || 48)) ;

    if (!isCodeValid) {
      if (barCode.length < 47) {
        throw new AppError('Bar Code is too short!');
      }

      if (barCode.length > 48) {
        throw new AppError('Bar Code is too long!');
      }
    }

    const slicedValue = barCode.slice(barCode.length - 10, barCode.length);
    const formatedValue = slicedValue.slice(0, 8) + '.' + slicedValue.slice(8, 10);
    const amount = parseFloat(formatedValue).toFixed(2);

    const boleto = {
      barCode,
      amount,
      expirationDate: '2018-07-16',
    };

    return boleto;
  }
}

export default ValidarBoletoService
