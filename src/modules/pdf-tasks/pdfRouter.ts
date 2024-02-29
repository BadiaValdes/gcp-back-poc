import { Request, Response, Router } from "express";
import { IRouter } from "../router.interface";
import pdfTasksController from "./controller/pdfTasksController";

const router = Router();

class PDFRouter implements IRouter {
  pdfTasksControllerInstance = pdfTasksController;
  // eslint-disable-line
  get routes() {
    router.get("/dummy1", async (req: Request, res: Response) => {
      return this.pdfTasksControllerInstance.test1(req, res);
    });

    // router.get("/dummy2", async (req: Request, res: Response) => {
    //   return this.loginController.dummy2(req, res);
    // });

  

    return router;
  }
}

export default new PDFRouter();
