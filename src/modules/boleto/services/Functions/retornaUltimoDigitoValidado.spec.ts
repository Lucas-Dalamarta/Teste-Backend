import { retornaUltimoDigitoValidado } from './retornaUltimoDigitoValidado';

describe('retornaUltimoDigitoValidado', () => {
  it('should return the correct digit', () => {
    const result = retornaUltimoDigitoValidado(
      '2129758700000020000001121100012100447561740',
    );

    expect(result).toBe(9);
  });
});
