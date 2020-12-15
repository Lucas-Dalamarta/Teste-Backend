import AppError from '@shared/errors/AppError';
import ValidarBoletoService from './ValidarBoletoService';

let validarBoleto: ValidarBoletoService;

describe('ValidarBoletoService', () => {
  beforeEach(() => {
    validarBoleto = new ValidarBoletoService();
  });

  it('should accept codes 48 characters long (Convênio)', async () => {
    const typedCode = '836000000015460201103138834403604020100240230860';

    const response = await validarBoleto.run({ typedCode });

    expect(response).toHaveProperty('codeBar');
  });

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

  it('should return codeBar', async () => {
    let typedCode = '';
    let response = undefined;

    typedCode = '21290001192110001210904475617405975870000002000';
    response = await validarBoleto.run({ typedCode });
    expect(response?.codeBar).toBe(
      '21299758700000020000001121100012100447561740',
    );

    typedCode = '817700000000010936599702411310797039001433708318';
    response = await validarBoleto.run({ typedCode });
    expect(response?.codeBar).toBe(
      '81770000000010936599704113107970300143370831',
    );
  });

  it(`should return amount`, async () => {
    let typedCode = '';
    let response = undefined;

    typedCode = '21290001192110001210904475617405975870000002000';
    response = await validarBoleto.run({ typedCode });
    expect(response?.amount).toBe('20.00');

    typedCode = '817700000000010936599702411310797039001433708318';
    response = await validarBoleto.run({ typedCode });
    expect(response?.amount).toBe('1.09');
  });

  it(`(Título) => shouldn't return the amount if it is not informed`, async () => {
    const typedCode = '21290001192110001210904475617405175870000000000';

    const response = await validarBoleto.run({ typedCode });

    expect(response?.amount).toBeUndefined();
  });

  it(`(Título) => should return the expiration date if it's field is different from 0000`, async () => {
    const typedCode = '21290001192110001210904475617405975870000002000';

    const response = await validarBoleto.run({ typedCode });

    expect(response?.expirationDate).toBe('2018-07-16');
  });

  it(`(Título) => shouldn't return the expiration date if it's field is 0000`, async () => {
    const typedCode = '21290001192110001210904475617405700000000002000';

    const response = await validarBoleto.run({ typedCode });

    expect(response?.expirationDate).toBeUndefined();
  });

  it(`(Título) => shouldn't allow wrong verification digits`, async () => {
    const invalidDV1 = '21290001102110001210904475617405975870000002000';
    const invalidDV2 = '21290001192110001210104475617405975870000002000';
    const invalidDV3 = '21290001192110001210904475617402975870000002000';
    const invalidDV4 = '21290001192110001210904475617405375870000002000';

    const invalidDVConvenio =
      '836000000025460201103138834403604020100240230860';

    await expect(
      validarBoleto.run({
        typedCode: invalidDV1,
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      validarBoleto.run({
        typedCode: invalidDV2,
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      validarBoleto.run({
        typedCode: invalidDV3,
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      validarBoleto.run({
        typedCode: invalidDV4,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it(`(Cônvenio) => shouldn't allow wrong verification digits`, async () => {
    const invalidDV1 = '836000000025460201103138834403604020100240230860';
    const invalidDV2 = '836900000024460201103137834403604020100240230860';
    const invalidDV3 = '836900000024460201103138834403604021100240230860';
    const invalidDV4 = '836900000024460201103138834403604020000240230860';
    const invalidDVGeral = '836000000023460201103138834403604020100240230860';

    await expect(
      validarBoleto.run({
        typedCode: invalidDV1,
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      validarBoleto.run({
        typedCode: invalidDV2,
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      validarBoleto.run({
        typedCode: invalidDV3,
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      validarBoleto.run({
        typedCode: invalidDV4,
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      validarBoleto.run({
        typedCode: invalidDVGeral,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
