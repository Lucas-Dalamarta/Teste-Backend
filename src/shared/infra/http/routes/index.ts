import { Router } from 'express';

import boletoRouter from '@modules/boleto/infra/routes/boleto.routes';

const routes = Router();

routes.use('/boleto', boletoRouter);

export default routes;
