import { Request, Response, Router } from 'express';
import { IRouter } from '../router.interface';
import userService from './services/userService'
import userSchema from './schemas/userSchema'
const router = Router();

class UserRouter implements IRouter{// eslint-disable-line
    get routes(){
        router.get('/', async (req: Request, res: Response) => {
            // eslint-disable-next-line no-useless-catch
            try {
                //const quote = await userService.getRandomTest();

                const quote = await userService.getUsers();
                return res.send(quote);
            } catch (err) {
                throw err;
            }
        });
        router.post('/', async (req: Request, res: Response) => {
            // eslint-disable-next-line no-useless-catch
            try {
                //const quote = await userService.getRandomTest();

                const quote = await userService.createUsers(req.body);
                return res.send(quote);
            } catch (err) {
                throw err;
            }
        });
        router.get('/create-table', async (req: Request, res: Response) => {
            // eslint-disable-next-line no-useless-catch
            try {
                const quote = await userSchema.createTableUser();
                return res.send(quote);
            } catch (err) {
                throw err;
            }
        });
        return router;
    }
}

export default new UserRouter();