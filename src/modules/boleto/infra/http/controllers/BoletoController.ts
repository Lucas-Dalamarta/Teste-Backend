import { Request, Response } from 'express';

import ValidarBoletoService from '@modules/boleto/services/ValidarBoletoService'

export default class BoletoController {
  public async validate(
    request: Request,
    response: Response,
  ): Promise<Response> {
    try {
      const typedCode = request.params.code;

      const validaBoleto = new ValidarBoletoService();

      const boleto = await validaBoleto.run({ typedCode });

      return response.json(boleto);
    } catch (err) {
      return response.status(400).json({error: err.message})
    }
  }
}
