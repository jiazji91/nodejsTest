import Express from 'express';
import HealthcheckController from './controllers/HealthcheckController';
import RegisterController from './controllers/RegisterController';

const router = Express.Router();

router.use('/', RegisterController);

router.use('/', HealthcheckController);

export default router;
