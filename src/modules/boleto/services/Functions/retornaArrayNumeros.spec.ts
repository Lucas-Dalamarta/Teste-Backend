import { retornaArrayNumeros } from './retornaArrayNumeros';

describe('retornaArrayNumeros', () => {
  it('should return the string into a array of digits', () => {
    const result = retornaArrayNumeros('212900011');

    expect(result).toStrictEqual([2, 1, 2, 9, 0, 0, 0, 1, 1]);
  });
});
