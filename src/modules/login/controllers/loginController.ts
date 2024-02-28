import { IResponseBody } from "src/interfaces/response.interface";
import loginService from "../services/loginService";
import { ILoginService } from "../services/loginService.interface";
import { Request, Response } from "express";
import { Sessions, session } from "../../../helpers/session";
import {
  bodyMessages,
  httpCode,
  responseBodyBase,
} from "../../../config/const";
import { PhoneMultiFactorInfo } from "firebase-admin/lib/auth/user-record";

class LoginController {
  loginService: ILoginService = loginService;

  async login(req: Request, res: Response) {
    const responseBody: IResponseBody = { ...responseBodyBase };

    try {
      let isDobleFac = false;
      const pp = Sessions.getInstance().getValue(req.body.email);
      if (!pp)
        isDobleFac = !!(await this.loginService.getUser(req.body.email))
          .multiFactor;
      if (!isDobleFac && !pp?.verified) {
        return this.doubleFacAuth(req, res);
      } else {
        await this.loginNormalFlow(
          responseBody,
          req.body.email,
          req.body.password
        );
      }
    } catch (error) {
      responseBody.message = error.message;
      responseBody.status = httpCode.BAD_REQUEST;
    }

    return res.status(responseBody.status).send({
      status: responseBody.status,
      message: responseBody.message,
      body: responseBody.body,
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
    const responseBody: IResponseBody = { ...responseBodyBase };
    try {
      responseBody.body = this.loginService.getUserInformation();
      responseBody.message = bodyMessages.successfulData;
    } catch (e) {
      responseBody.message = e;
      responseBody.status = httpCode.BAD_REQUEST;
    }

    return res.status(responseBody.status).send({
      status: responseBody.status,
      body: responseBody.body,
      message: responseBody.message,
    });
  }

  async sendMailPasswordReset(req: Request, res: Response) {
    const responseBody: IResponseBody = { ...responseBodyBase };

    try {
      await this.loginService.sendPasswordResetMail(req.body.email);
      responseBody.message = bodyMessages.successfulMailSend;
    } catch (error) {
      responseBody.status = httpCode.BAD_REQUEST;
      responseBody.message = error;
    }

    return res.status(responseBody.status).send({
      status: responseBody.status,
      body: responseBody.body,
      message: responseBody.message,
    });
  }

  async getUser(req: Request, res: Response){
    const responseBody: IResponseBody = { ...responseBodyBase };

    return res.status(responseBody.status).send({
      status: responseBody.status,
      body: await this.loginService.getUser(req.body.email),
      message: responseBody.message,
    });
  }

  
  async getUserPhone(req: Request, res: Response){
    const responseBody: IResponseBody = { ...responseBodyBase };

    return res.status(responseBody.status).send({
      status: responseBody.status,
      body: {
        phone: ((await this.loginService.getUser(req.body.email)).multiFactor.enrolledFactors[0] as PhoneMultiFactorInfo).phoneNumber ?? null
      },
      message: bodyMessages.successfulPhoneNumber,
    });
  }

  verifyTwoStepCode(req: Request, res: Response) {
    const responseBody: IResponseBody = { ...responseBodyBase };

    const email = req.body.email;
    const code = req.body.code;

    try {
      // const pp = session.find((session) => session.email === email);
      const pp = Sessions.getInstance().getValue(email);
      if (!pp) {
        throw new Error(bodyMessages.mailDoesntExist);
      }

      if (!code) {
        throw new Error(bodyMessages.codeDoesntExist);
      }

      this.loginService.verifyCode(code, pp);

      pp.verified = true;

      responseBody.message = bodyMessages.successfulCode;
    } catch (error) {
      responseBody.status = httpCode.BAD_REQUEST;
      responseBody.message = error.message;
    } finally {
      console.log(Sessions.getInstance().getValue(email));
      if (Sessions.getInstance().getValue(email).count > 3) {
        Sessions.getInstance().removeData(email);
      }
    }

    console.log(responseBody);

    return res.status(responseBody.status).send({
      status: responseBody.status,
      body: responseBody.body,
      message: responseBody.message,
    });
  }

  /**
   * Este método permite la habilitación o des habilitación del doble factor de autenticación en un usuario. Si el número de teléfono no es proporcionado, entonces se desactivará el doble factor en la cuenta del usuario
   * @param req Express request. Necesita el email y el número de teléfono (opcional)
   * @param res  Express response
   * @returns Express Response
   */
  async setPhoneAuth(req: Request, res: Response) {
    const responseBody: IResponseBody = { ...responseBodyBase };

    await this.loginService.setPhone2MFA(
      req.body.email,
      req.body.phoneNumber ?? undefined
    );

    return res.status(responseBody.status).send({
      status: responseBody.status,
      body: responseBody.body,
      message: responseBody.message,
    });
  }

  /** Private methods */

  private async loginNormalFlow(
    responseBody: IResponseBody,
    email: string,
    password: string
  ): Promise<void> {
    const login = await this.loginService.login(email, password);
    Sessions.getInstance().removeData(email);
    responseBody.message = login.message;
    responseBody.body = login.body;
  }

  private async doubleFacAuth(req: Request, res: Response) {
    const responseBody: IResponseBody = { ...responseBodyBase };

    try {
      const code = this.loginService.sendCodeEmail(req.body.email);

      Sessions.getInstance().addData(req.body.email, {
        email: req.body.email,
        code: code,
        creation: Date.now(),
        count: 0,
        verified: false,
      });

      responseBody.message = bodyMessages.dobleFac;
      responseBody.status = httpCode.PAGE_EXPIRED;
    } catch (error) {
      responseBody.status = httpCode.BAD_REQUEST;
      responseBody.message = error;
    }

    res.cookie("cookie", "123", { httpOnly: false });
    return res.status(responseBody.status).send({
      status: responseBody.status,
      message: responseBody.message,
    });
  }
}

//await loginService.login(req.body)
export default new LoginController();
