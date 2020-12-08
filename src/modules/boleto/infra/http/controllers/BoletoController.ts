import { Request, Response } from 'express';

import ValidarBoletoService from '@modules/boleto/services/ValidarBoletoService'

export default class BoletoController {
  public async validate(
    request: Request,
    response: Response,
  ): Promise<Response> {
    try {
      const code = request.params.code;

      const validaBoleto = new ValidarBoletoService();

      const boleto = await validaBoleto.run({ barCode : code });

      return response.json(boleto);
    } catch (err) {
      return response.status(400).json({error: err.message})
    }
  }
}

// 21290001192110001210904475617405975870000002000;
// 21299758700000020000001121100012100447561740;
// AAABCDDDDDDDDDDYCCCCXEEEEEEEEEEZkUUUUVVVVVVVVVV;
