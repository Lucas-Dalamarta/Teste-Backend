import AppError from '@shared/errors/AppError';
import ValidarBoletoService from './ValidarBoletoService';

let validarBoleto: ValidarBoletoService;

describe('ValidarBoletoService', () => {
  beforeEach(() => {
    validarBoleto = new ValidarBoletoService();
  });

  it('should not accept barcodes less than 47 digits long', async () => {
    const barCode = '1';

    await expect(
      validarBoleto.run({
        barCode,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not accept barcodes longer than 48 digits', async () => {
    const barCode = '2129000119211000121090447561740597587000000200000';

    await expect(
      validarBoleto.run({
        barCode,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should accept barcodes that have 47 digits', async () => {
    const barCode = '21290001192110001210904475617405975870000002000';

    const boleto = await validarBoleto.run({ barCode });

    expect(boleto).toHaveProperty('amount');
  });
});
