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
      return res.status(200).send("Hola Mundo")
    });

    // router.get("/dummy2", async (req: Request, res: Response) => {
    //   return this.loginController.dummy2(req, res);
    // });

    router.post("/", async (req: Request, res: Response) => {
      return this.loginController.login(req, res);
    });

    router.post("/user", async (req: Request, res: Response) => {
      return this.loginController.getUser(req, res);
    });

    router.post("/user/phone", async (req: Request, res: Response) => {
      return this.loginController.getUserPhone(req, res);
    });


    router.post("/change-password-login", async (req: Request, res: Response) => {
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

    router.post("/2mfa", async (req: Request, res: Response) => {
      return this.loginController.setPhoneAuth(req, res);
    });

    return router;
  }
}

export default new LoginRouter();
