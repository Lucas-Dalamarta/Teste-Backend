import { retornaSomaTotalDoCampo } from './retornaSomaTotalDoCampo';

describe('retornaSomaTotalDoCampo', () => {
  it('should calculate correctly if number has more than 1 digit', () => {
    let input = []

    input = [4, 0, 1, 8, 4, 7, 1, 3, 0, 3];
    const result1 = retornaSomaTotalDoCampo(input);
    expect(result1).toBe(31);

    input = [0, 3, 8, 0, 9, 6, 5, 0, 3, 2];
    const result2 = retornaSomaTotalDoCampo(input);
    expect(result2).toBe(36);
  });
});
