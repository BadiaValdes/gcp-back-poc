import { Request, Response } from "express";
import { PhoneMultiFactorInfo } from "firebase-admin/lib/auth/user-record";
import { ITwoStepCode } from "src/interfaces/two-step-code.interface";
import {
  bodyMessages,
  httpCode,
  responseBodyBase,
} from "../../../config/const";
import sessionsImpl from "../../../helpers/sessions/impl/sessions.impl";
import { ISessions } from "../../../helpers/sessions/sessions.interface";
import { IResponseBody } from "../../../interfaces/response.interface";
import loginService from "../services/loginService";
import { ILoginService } from "../services/loginService.interface";
import { checkJailTime } from "./auxiliars/check-jail-time";

class LoginController {
  loginService: ILoginService = loginService;
  sessionService: ISessions = sessionsImpl;

  async login(req: Request, res: Response) {
    const responseBody: IResponseBody = { ...responseBodyBase };
    const pp = this.sessionService.getValue(req.body.email) as ITwoStepCode;

    try {
      let isDobleFac = false;

      if (pp) {
        this.checkCodeError(pp, req.body.email);
      } else
        isDobleFac = !!(await this.loginService.getUser(req.body.email))
          .multiFactor;

      await this.loginNormalFlow(
        responseBody,
        req.body.email,
        req.body.password
      );

      if (!isDobleFac && !pp?.verified)
        return await this.doubleFacAuth(req, res);
    } catch (error) {
      if (
        error.message.code &&
        error.message.code == "auth/invalid-credential"
      ) {
        this.sessionService.setValue(req.body.email, {
          ...pp,
          countLogin: pp.countLogin < 5 ? pp.countLogin + 1 : pp.countLogin,
          loginError: pp.countLogin > 5 ? Date.now() : undefined,
        } as ITwoStepCode);
      }
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

  async getUser(req: Request, res: Response) {
    const responseBody: IResponseBody = { ...responseBodyBase };

    return res.status(responseBody.status).send({
      status: responseBody.status,
      body: await this.loginService.getUser(req.body.email),
      message: responseBody.message,
    });
  }

  async getUserPhone(req: Request, res: Response) {
    const responseBody: IResponseBody = { ...responseBodyBase };

    return res.status(responseBody.status).send({
      status: responseBody.status,
      body: {
        phone:
          (
            (await this.loginService.getUser(req.body.email)).multiFactor
              .enrolledFactors[0] as PhoneMultiFactorInfo
          ).phoneNumber ?? null,
      },
      message: bodyMessages.successfulPhoneNumber,
    });
  }

  verifyTwoStepCode(req: Request, res: Response) {
    const responseBody: IResponseBody = { ...responseBodyBase };

    const email = req.body.email;
    const code = req.body.code;
    const pp = this.sessionService.getValue(email) as ITwoStepCode;

    console.log(pp);

    try {
      // const pp = session.find((session) => session.email === email);

      if (!pp) {
        throw new Error(bodyMessages.mailDoesntExist);
      }

      if (!code) {
        throw new Error(bodyMessages.codeDoesntExist);
      }

      this.loginService.verifyCode(code, pp);

      this.sessionService.setValue(email, {
        ...pp,
        verified: true,
      });

      responseBody.message = bodyMessages.successfulCode;
    } catch (error) {
      this.sessionService.setValue(email, {
        ...pp,
        count: pp.count + 1,
      } as ITwoStepCode);
      responseBody.status = httpCode.BAD_REQUEST;
      responseBody.message = error.message;
    } finally {
      console.log("Quitando datos");
      if (pp.count > 5) {
        this.sessionService.setValue(email, {
          ...pp,
          codeError: Date.now(),
        } as ITwoStepCode);
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
    this.sessionService.removeValue(email);
    responseBody.message = login.message;
    responseBody.body = login.body;
  }

  private async doubleFacAuth(req: Request, res: Response) {
    const responseBody: IResponseBody = { ...responseBodyBase };

    try {
      const code = this.loginService.sendCodeEmail(req.body.email);

      this.sessionService.setValue(req.body.email, {
        email: req.body.email,
        code: code,
        creation: Date.now(),
        count: 0,
        countLogin: 0,
        verified: false,
      } as ITwoStepCode);

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

  private checkCodeError(pp: ITwoStepCode, email: string) {
    if (
      pp.codeError &&
      checkJailTime(pp.codeError) &&
      pp.loginError &&
      checkJailTime(pp.loginError)
    ) {
      throw Error("Cuenta bloqueada, espere unos minutos");
    } else {
      this.sessionService.setValue(email, {
        ...pp,
        codeError: undefined,
        loginError: undefined,
        count: 0,
      } as ITwoStepCode);
    }
  }
}

//await loginService.login(req.body)
export default new LoginController();
