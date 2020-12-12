import { retornaMultiplicacaoDosNumeros } from './retornaMultiplicacaoDosNumeros';

describe('retornaMultiplicacaoDosNumeros', () => {
  it('should return correct multiplication of the numbers', () => {
    const result = retornaMultiplicacaoDosNumeros([2, 1, 2, 9, 0, 0, 0, 1, 1]);

    expect(result).toStrictEqual([4, 1, 4, 9, 0, 0, 0, 1, 2]);
  });

  it('should calculate correctly if number has more than 1 digit', () => {
    const input = [4, 0, 1, 4, 4, 8, 1, 6, 0, 6];

    const result = retornaMultiplicacaoDosNumeros(input);

    expect(result).toStrictEqual([4, 0, 1, 8, 4, 7, 1, 3, 0, 3]);
  });
});
