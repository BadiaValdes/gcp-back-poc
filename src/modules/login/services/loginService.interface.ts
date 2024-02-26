import { AdditionalUserInfo } from "firebase/auth";
import { codeResponse } from "../../../helpers/responseType";
import { IResponseBody } from "../../../interfaces/response.interface";

export interface ILoginService{
    login (body: any): Promise<string>;
    login2 (): Promise<IResponseBody>;
    asyncUpdatePassword (password: string): Promise<IResponseBody>;
    getUserInformation(): AdditionalUserInfo;
    sendPasswordResetMail(email: string):  Promise<void>;
    sendCodeEmail(email: string): string;
}