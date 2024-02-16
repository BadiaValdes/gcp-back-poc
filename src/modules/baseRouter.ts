import { Router } from 'express';
import { IRouter } from './router.interface';
import userRouter from './user/userRouter'
import loginRouter from './login/loginRouter';
import folioRouter from './folio/folioRouter';

// Init router
const router = Router();

class BaseRouter implements IRouter{// eslint-disable-line
    get routes(){
        // router.use('/users', userRouter.routes);
        router.use('/login', loginRouter.routes);
        router.use('/folios', folioRouter.routes);
        return router;
    }
}

export default new BaseRouter();