import AppError from '@shared/errors/AppError';
import ValidarBoletoService from './ValidarBoletoService';

let validarBoleto: ValidarBoletoService;

describe('ValidarBoletoService', () => {
  beforeEach(() => {
    validarBoleto = new ValidarBoletoService();
  });

  it("should accept codes 48 characters long (Convênio)", async () => {
    const typedCode = '836000000015460201103138834403604020100240230860';

    const response = await validarBoleto.run({ typedCode })

    expect(response).toHaveProperty('codeBar');
  })

  it('should accept codes 47 characters long (Título)', async () => {
    const typedCode = '21290001192110001210904475617405975870000002000';

    const response = await validarBoleto.run({ typedCode });

    expect(response).toHaveProperty('codeBar');
  });

  it(`shouldn't accept codes longer than 48 characters`, async () => {
    const typedCode = '8360000000154602011031388344036040201002402308609';

    await expect(
      validarBoleto.run({
        typedCode,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it(`shouldn't accept codes shorter than 47 characters`, async () => {
    const typedCode = '2129000119211000121090447561740597587000000200';

    await expect(
      validarBoleto.run({
        typedCode,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it(`shouldn't accept codes with letters or special characters`, async () => {
    const typedCode = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

    await expect(
      validarBoleto.run({
        typedCode,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

});


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
