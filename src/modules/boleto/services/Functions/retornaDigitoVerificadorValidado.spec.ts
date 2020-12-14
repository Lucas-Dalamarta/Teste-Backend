import { retornaDVModulo10 } from './retornaDigitoVerificadorValidado';

describe('retornaDigitoVerificadorValidado', () => {
  it('should return correct sum of the digits', () => {
    let result = 0;

    result = retornaDVModulo10('212900011');
    expect(result).toBe(9);

    result = retornaDVModulo10('2110001210')
    expect(result).toBe(9);

    result = retornaDVModulo10('0447561740')
    expect(result).toBe(5);
  });
});
