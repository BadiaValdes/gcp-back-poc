import { Request, Response, Router } from 'express'
import { IRouter } from '../router.interface'
import loginService from './services/loginService';

const router = Router()

class LoginRouter implements IRouter {
  // eslint-disable-line
  get routes() {
    router.post('/', async (req: Request, res: Response) => {
        try {
            const quote = await loginService.login(req.body)
            return res.status(quote.status).send(quote)
          } catch (err) {
            return res.status(err.status).send(err)
          }
    })
    return router
  }
}

export default new LoginRouter()
