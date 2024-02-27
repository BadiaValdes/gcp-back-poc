import { AdditionalUserInfo } from "firebase/auth";
import { codeResponse, successResponse } from "../../../helpers/responseType";
import { IResponseBody } from "../../../interfaces/response.interface";
import { ITwoStepCode } from "src/interfaces/two-step-code.interface";
import { UserRecord } from "firebase-admin/lib/auth/user-record";

export interface ILoginService {
  login(email: string, password: string): Promise<successResponse>;
  getUser(email: string): Promise<UserRecord>;
  asyncUpdatePassword(password: string): Promise<IResponseBody>;
  getUserInformation(): AdditionalUserInfo;
  sendPasswordResetMail(email: string): Promise<void>;
  sendCodeEmail(email: string): string;
  verifyCode(code: string, verificationCode: ITwoStepCode): boolean;
  setPhone2MFA(
    email: string,
    phoneNumber: string | undefined
  ): Promise<boolean>;
}
