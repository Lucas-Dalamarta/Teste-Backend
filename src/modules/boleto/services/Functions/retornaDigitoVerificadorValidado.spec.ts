import { retornaDigitoVerificadorValidado } from './retornaDigitoVerificadorValidado';

describe('retornaDigitoVerificadorValidado', () => {
  it('should return correct sum of the digits', () => {
    let result = 0;

    result = retornaDigitoVerificadorValidado('212900011');
    expect(result).toBe(9);

    result = retornaDigitoVerificadorValidado('2110001210')
    expect(result).toBe(9);

    result = retornaDigitoVerificadorValidado('0447561740')
    expect(result).toBe(5);
  });
});
