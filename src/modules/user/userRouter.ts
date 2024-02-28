import { Request, Response, Router } from "express";
import { IRouter } from "../router.interface";
import userController from "./controllers/user.controller";

const router = Router();

class UserRouter implements IRouter {
  userControllerInstance = userController;
  // eslint-disable-line
  get routes() {
    router.get("/", async (req: Request, res: Response) => {
      return await this.userControllerInstance.getUserInfo(req, res);
    });

    router.post("/update", async (req: Request, res: Response) => {
      return this.userControllerInstance.updateUserInfo(req, res);
    });

    return router;
  }
}

export default new UserRouter();
