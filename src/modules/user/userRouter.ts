import { Request, Response, Router } from 'express'
import { IRouter } from '../router.interface'
import userService from './services/userService'
import userSchema from './schemas/userSchema'

const router = Router()


class UserRouter implements IRouter {
  // eslint-disable-line
  get routes() {
    router.get('/', async (req: Request, res: Response) => {
      // eslint-disable-next-line no-useless-catch
      try {
        const quote = await userService.getUsers()
        return res.status(quote.status).send(quote)
      } catch (err) {
        return res.status(err.status).send(err)
      }
    })
    router.post('/', async (req: Request, res: Response) => {
      // eslint-disable-next-line no-useless-catch
      try {
        req.body.photo = req.file;
        const quote = await userService.createUsers(req.body)
        return res.status(quote.status).send(quote)
      } catch (err) {
        return res.status(err.status).send(err)
      }
    })
    router.put('/:id', async (req: Request, res: Response) => {
      // eslint-disable-next-line no-useless-catch
      try {
        const quote = await userService.updateUsers(req.body, req.params.id)
        return res.status(quote.status).send(quote)
      } catch (err) {
        return res.status(err.status).send(err)
      }
    })
    router.delete('/:id', async (req: Request, res: Response) => {
      // eslint-disable-next-line no-useless-catch
      try {
        const quote = await userService.deleteUsers(req.params.id)
        return res.status(quote.status).send(quote)
      } catch (err) {
        return res.status(err.status).send(err)
      }
    })
    router.get('/getImage/:name', async (req: Request, res: Response) => {
      // eslint-disable-next-line no-useless-catch
      try {
        const quote = await userService.getImage(req.params.name)
        return res.status(quote.status).send(quote)
      } catch (err) {
        return res.status(err.status).send(err)
      }
    })
    router.post('/create-table', async (req: Request, res: Response) => {
      try {
        const quote = await userSchema.createTableUser()
        return res.status(quote.status).send(quote)
      } catch (err) {
        return res.status(err.status).send(err)
      }
    })
    return router
  }
}

export default new UserRouter()
