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

  it(`shouldn't accept codes with letters`, async () => {
    const typedCode = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

    await expect(
      validarBoleto.run({
        typedCode,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

});


