import { retornaDVModulo10 } from './retornaDVModulo10';

describe('retornaDigitoVerificadorValidado', () => {
  it('should return correct DV', () => {
    let result = 0;

    //  Título
    result = retornaDVModulo10('212900011');
    expect(result).toBe(9);

    result = retornaDVModulo10('2110001210');
    expect(result).toBe(9);

    result = retornaDVModulo10('0447561740');
    expect(result).toBe(5);

    result = retornaDVModulo10('0447561740');
    expect(result).toBe(5);

    //  Cônvenio
    result = retornaDVModulo10('81770000000');
    expect(result).toBe(0);

    result = retornaDVModulo10('84670000001');
    expect(result).toBe(7);
  });
});
