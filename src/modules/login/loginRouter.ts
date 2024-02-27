import { Request, Response, Router } from "express";
import { IRouter } from "../router.interface";
import loginService from "./services/loginService";
import loginController from "./controllers/loginController";

const router = Router();

class LoginRouter implements IRouter {
  loginController = loginController;
  // eslint-disable-line
  get routes() {
    router.get("/dummy1", async (req: Request, res: Response) => {
      return this.loginController.dummy1(req, res);
    });

    router.get("/dummy2", async (req: Request, res: Response) => {
      return this.loginController.dummy2(req, res);
    });

    router.post("/", async (req: Request, res: Response) => {
      return this.loginController.login(req, res);
    });

    router.post("/change-password", async (req: Request, res: Response) => {
      return await loginController.changePassword(req, res);
    });

    router.post("/user-information", async (req: Request, res: Response) => {
      return await this.loginController.getUserInformation(req, res);
    });

    router.post("/change-password", async (req: Request, res: Response) => {
      return await this.loginController.sendMailPasswordReset(req, res);
    });

    router.post("/verify-code", async (req: Request, res: Response) => {
      return this.loginController.verifyTwoStepCode(req, res);
    });

    return router;
  }
}

export default new LoginRouter();
