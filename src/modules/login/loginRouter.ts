import { Request, Response, Router } from "express";
import { IRouter } from "../router.interface";
import loginService from "./services/loginService";

const router = Router();

class LoginRouter implements IRouter {
  // eslint-disable-line
  get routes() {
    router.get("/dummy", async (req: Request, res: Response) => {
      try {
       
        return res.status(200).send("hola");
      } catch (err) {
        return res.status(err.status).send(err);
      }
    });
    router.post("/", async (req: Request, res: Response) => {
      try {
        const quote = await loginService.login(req.body);
        return res.status(quote.status).send(quote);
      } catch (err) {
        return res.status(err.status).send(err);
      }
    });
    router.get("/2", async (req: Request, res: Response) => {
      try {
        const quote = await loginService.login2(req.body);
      } catch (err) {
        return res.status(err.status).send(err);
      }
    }),
      router.post("/change-password", async (req: Request, res: Response) => {
        try {
          const quote = await loginService.asyncUpdatePassword(
            req.body.password
          );
          return res.status(quote.status).send(quote);
        } catch (err) {
          return res.status(err.status).send(err);
        }
      }),
      router.get("/loginWithPopup", async (req: Request, res: Response) => {
        try {
          const quote = await loginService.loginWithPopup();
          return res.status(200);
        } catch (err) {
          return res.status(500);
        }
      }),
      router.post("/userInformation", async (req: Request, res: Response) => {
        try {
          const quote = await loginService.getUserInformation();
          return res.status(200).send(quote);
        } catch (err) {
          return res.status(err.status).send(err);
        }
      }),
      router.post("/multiFactor", async (req: Request, res: Response) => {
        try {
          const quote = await loginService.multiFactor();
          return res.status(200);
        } catch (err) {
          return res.status(500);
        }
      });
      router.post("/changePassword", async (req: Request, res: Response) => {
        try {
          const quote = await loginService.changePassword(req.body.email);
          return res.status(200);
        } catch (err) {
          return res.status(500);
        }
      });
    return router;
  }
}

export default new LoginRouter();
