import { IResponseBody } from "src/interfaces/response.interface";
import loginService from "../services/loginService";
import { ILoginService } from "../services/loginService.interface";
import { Request, Response } from "express";
import { Sessions, session } from "../../../helpers/session";
import { Session } from "inspector";

class LoginController {
  loginService: ILoginService = loginService;

  // dummy1(req: Request, res: Response) {
  //   Sessions.getInstance().addData("_dummy",'hola')
  //   res.status(200).send(Sessions.getInstance().getValue("_dummy"));
  // }

  // dummy2(req: Request, res: Response) {
  //   res.status(200).send(Sessions.getInstance().getValue("_dummy"));
  // }

  async login(req: Request, res: Response) {
    const responseBody: IResponseBody = {
      status: 200,
      message: "PlaceHolder",
    };


    try {
      let isDobleFac = false;
      // const pp = session.find(session => session.email === req.body.email);
      // const pp = Sessions.getInstance().getValue(req.body.email);
      // if (!pp) isDobleFac = await this.loginService.getUser(req.body.email);
      // if (isDobleFac && !pp?.verified) {
      //   return this.doubleFacAuth(req, res);
      // } else {
        const login = await this.loginService.login(req.body);
        Sessions.getInstance().removeData(req.body.email)
        responseBody.message = login.message;
        responseBody.body = login.body;
      // }
    } catch (error) {
      responseBody.message = error.message;
      responseBody.status = 400;
    }

    return res.status(responseBody.status).send({
      status: responseBody.status,
      message: responseBody.message,
      body: responseBody.body,
    });
  }

  async doubleFacAuth(req: Request, res: Response) {
    const responseBody: IResponseBody = {
      status: 200,
      message: "PlaceHolder",
    };

    try {
      const code = this.loginService.sendCodeEmail(req.body.email);
      // session.push({
      //   email: req.body.email,
      //   code: code,
      //   creation: Date.now(),
      //   count: 0,
      //   verified: false
      // })

      Sessions.getInstance().addData(req.body.email, {
        email: req.body.email,
        code: code,
        creation: Date.now(),
        count: 0,
        verified: false,
      });

      /*req.session[req.body.email] = {
        code: code,
        creation: Date.now(),
        count: 0,
        verified: false,
      };*/
      responseBody.message = "Doble Factor Auth";
      responseBody.status = 419;
    } catch (error) {
      responseBody.status = 400;
      responseBody.message = error;
    }

    res.cookie("cookie", "123", { httpOnly: false });
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
      // const pp = session.find((session) => session.email === email);
      const pp = Sessions.getInstance().getValue(email);
      if (!pp) {
        responseBody.message = "El correo no existe";
        throw new Error("El correo no existe");
      }

      if (!code) {
        responseBody.message = "El código no existe";
        throw new Error("El código no existe");
      }

      this.loginService.verifyCode(code, pp);



      responseBody.message = "Código verificado correctamente";
    } catch (error) {
      responseBody.status = 400;
      responseBody.message = error;
    } finally {
      console.log(Sessions.getInstance().getValue(email));
      if (Sessions.getInstance().getValue(email).count > 3) {
        Sessions.getInstance().removeData(email);
      }
    }

    return res.status(responseBody.status).send({
      status: responseBody.status,
      body: responseBody.body,
      message: responseBody.message,
    });
  }

  // Activar/Desactivar factor por teléfono
  async setPhoneAuth(req: Request, res: Response){
    const responseBody: IResponseBody = {
      status: 200,
      message: "PlaceHolder",
    };

    await this.loginService.setPhone2MFA(req.body.email, req.body.activate);

    return res.status(responseBody.status).send({
      status: responseBody.status,
      body: responseBody.body,
      message: responseBody.message,
    });
  }
}

//await loginService.login(req.body)
export default new LoginController();
