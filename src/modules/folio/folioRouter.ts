import { Request, Response, Router } from 'express'
import { IRouter } from '../router.interface'
import { IFolioService } from './interfaces/folio-service.interface'
import { folioService } from './services/folio.service'
import { ApiOperationGet, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts'

const router = Router()

// Controller
@ApiPath({
  path:'/folios',
  name: 'Folios'
})
class FolioRouter implements IRouter {

  // eslint-disable-line
  @ApiOperationGet({
    description: 'Obtener un listado de folios',
    summary: "LIstado de folios",
    responses: {
      200: {
        description: "Success",
        type: SwaggerDefinitionConstant.Response.Type.ARRAY,
        model: 'String'
      },
      400: {
        description: 'Error'
      }
    }
  })
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
