import { Request, Response, Router } from 'express'
import { IRouter } from '../router.interface'
import { IFolioService } from './interfaces/folio-service.interface'
import { folioService } from './services/folio.service'

const router = Router()

// Controller

class FolioRouter implements IRouter {

  // eslint-disable-line
  get routes() {
    router.get('/', async (req: Request, res: Response) => {
      // eslint-disable-next-line no-useless-catch
      try {
        return res.status(200).send(await folioService.getFolios())
      } catch (err) {
        return res.status(err.status).send(err)
      }
    })
    return router
  }
}

export default new FolioRouter()
