import {Router} from 'express'

import BoletoController from '../http/controllers/BoletoController';

const boletoRouter = Router();
const boletoController = new BoletoController();


boletoRouter.get('/:code', boletoController.validate);

export default boletoRouter;
