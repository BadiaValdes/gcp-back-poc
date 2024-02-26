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
      const code = await this.loginService.login(req.body);
      req.session[req.body.email] = code;
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
}

//await loginService.login(req.body)
export default new LoginController();
