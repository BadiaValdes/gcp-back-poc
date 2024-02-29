import { Router } from 'express';
import docuSignRoutes from './docu-sign/docu-sign.routes';
import folioRouter from './folio/folioRouter';
import loginRouter from './login/loginRouter';
import pdfRouter from './pdf-tasks/pdfRouter';
import { IRouter } from './router.interface';
import userRouter from './user/userRouter';

// Init router
const router = Router();

class BaseRouter implements IRouter{// eslint-disable-line
    get routes(){
        // router.use('/users', userRouter.routes);
        router.use('/login', loginRouter.routes);
        router.use('/folios', folioRouter.routes);
        router.use('/docusign', docuSignRoutes.routes);
        router.use('/pdf', pdfRouter.routes);
        router.use('/user', userRouter.routes);
        return router;
    }
}

export default new BaseRouter();