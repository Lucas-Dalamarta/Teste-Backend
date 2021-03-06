import { retornaSomaDosDigitos } from './retornaSomaDosDigitos';

describe('retornaSomaDosDigitos', () => {
  it('should return correct sum of the multiple digits', () => {

    const result = retornaSomaDosDigitos(12);

    expect(result).toBe(3);
  });

  it('should return the same number if it has only one digit', () => {
    const result = retornaSomaDosDigitos(1);

    expect(result).toBe(1);
  });
})
