import { retornaDVModulo11Convenio } from "./retornaDVModulo11Convenio";

describe('retornaDVModulo11Convenio', () => {
  it('should calculate DV correctly', () => {
    const input = '01230067896';

    const result = retornaDVModulo11Convenio(input)

    expect(result).toBe(0)
  })
});
