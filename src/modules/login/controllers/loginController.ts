import { IResponseBody } from "src/interfaces/response.interface";
import loginService from "../services/loginService";
import { ILoginService } from "../services/loginService.interface";
import { Request, Response } from "express";

class LoginController {
  loginService: ILoginService = loginService;

  async login(req: Request, res: Response) {
    const responseBody: IResponseBody = {
      status: 200,
      message: "PlaceHolder",
    };

    try {
      let isDobleFac = false;
      if (!req.session[req.body.email])
        isDobleFac = await this.loginService.getUser(req.body.email);
      if (isDobleFac && !req.session[req.body.email].verified) {
        this.doubleFacAuth(req, res);
      } else {
        const login = await this.loginService.login(req.body);
        delete req.session[req.body.email];
        responseBody.message = login.message;
        responseBody.body = login.body;
      }
    } catch (error) {
      responseBody.message = error.message;
      responseBody.status = 400;
    }

    return res.status(responseBody.status).send({
      status: responseBody.status,
      message: responseBody.message,
    });
  }

  async doubleFacAuth(req: Request, res: Response) {
    const responseBody: IResponseBody = {
      status: 200,
      message: "PlaceHolder",
    };

    try {
      const code = this.loginService.sendCodeEmail(req.body.email);
      req.session[req.body.email] = {
        code: code,
        creation: Date.now(),
        count: 0,
        verified: false,
      };
      console.log(req.session);
      responseBody.message = "Login correcto";
    } catch (error) {
      responseBody.status = 400;
      responseBody.message = error;
    }

    return res.status(responseBody.status).send({
      status: responseBody.status,
      message: responseBody.message,
    });
  }

  async changePassword(req: Request, res: Response) {
    const responseBody = await this.loginService.asyncUpdatePassword(
      req.body.password
    );

    return res.status(responseBody.status).send({
      status: responseBody.status,
      body: responseBody.body,
      message: responseBody.message,
    });
  }

  async getUserInformation(req: Request, res: Response) {
    const responseBody: IResponseBody = {
      status: 200,
      message: "PlaceHolder",
    };
    try {
      responseBody.body = this.loginService.getUserInformation();
      responseBody.message = "Datos obtenidos satisfactoriamente";
    } catch (e) {
      responseBody.message = e;
      responseBody.status = 400;
    }

    return res.status(responseBody.status).send({
      status: responseBody.status,
      body: responseBody.body,
      message: responseBody.message,
    });
  }

  async sendMailPasswordReset(req: Request, res: Response) {
    const responseBody: IResponseBody = {
      status: 200,
      message: "PlaceHolder",
    };

    try {
      await this.loginService.sendPasswordResetMail(req.body.email);
      responseBody.message = "Correo enviado satisfactoriamente";
    } catch (error) {
      responseBody.status = 400;
      responseBody.message = error;
    }

    return res.status(responseBody.status).send({
      status: responseBody.status,
      body: responseBody.body,
      message: responseBody.message,
    });
  }

  verifyTwoStepCode(req: Request, res: Response) {
    const responseBody: IResponseBody = {
      status: 200,
      message: "PlaceHolder",
    };

    const email = req.body.email;
    const code = req.body.code;

    try {
      if (!req.session[email]) {
        throw new Error("El correo no existe");
      }

      if (!code) {
        throw new Error("El código no existe");
      }

      console.log(req.session[email]);

      this.loginService.verifyCode(code, req.session[email]);

      responseBody.message = "Código verificado correctamente";
    } catch (error) {
      responseBody.status = 400;
      responseBody.message = error;
    } finally {
      if (req.session[email].count > 3) {
        delete req.session[email];
      }
    }

    return res.status(responseBody.status).send({
      status: responseBody.status,
      body: responseBody.body,
      message: responseBody.message,
    });
  }
}

//await loginService.login(req.body)
export default new LoginController();
