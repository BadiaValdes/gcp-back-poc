import { ILoginService } from "./loginService.interface";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  getAuth,
  User,
  updatePassword,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
  UserCredential,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
  getMultiFactorResolver,
  signInWithRedirect,
  sendPasswordResetEmail,
} from "firebase/auth";
import { app, firebaseAdmin } from "../../../helpers/init-firebase";
import { codeResponse, successResponse } from "src/helpers/responseType";
import * as admin from "firebase-admin";
require("firebase-admin/auth");
// import speakeasy, { GeneratedSecret } from "speakeasy";
import qrcode from "qrcode";
import { transporter } from "../../../helpers/email";
import { IResponseBody } from "src/interfaces/response.interface";
import { ITwoStepCode } from "src/interfaces/two-step-code.interface";
var CodeGenerator = require("node-code-generator");

class LoginService implements ILoginService {
  // eslint-disable-line
  res: any;

  auth = getAuth(app);
  user: User;
  userCredential: UserCredential;
  // secret: GeneratedSecret;

  async login(body: any): Promise<any> {
    const login = {
      email: body.email,
      password: body.password,
    };

    const code = this.sendCodeEmail(login.email);

    return new Promise<string>((resolve, reject) => {
      resolve(code);
    });

    // return new Promise<string>((resolve, reject) => {

    //   /*signInWithEmailAndPassword(this.auth, login.email, login.password)
    //     .then((userCredential) => {
    //       this.userCredential = userCredential
    //       this.user = userCredential.user
    //       resolve({ status: 200, body: userCredential, message: 'Login exitosamente' })
    //     })
    //     .catch((error: any) => {
    //       console.log(error)
    //       if (error.code == 'auth/multi-factor-auth-required') {
    //         // The user is a multi-factor user. Second factor challenge is required.
    //         // ...
    //       } else if (error.code == 'auth/wrong-password') {
    //         // Handle other errors such as wrong password.
    //       }
    //       reject({ status: 400, message: error })
    //     })*/

    //     resolve();
    //  return this.sendCodeEmail(login.email)
    //     .then((code: codeResponse) => {
    //       resolve({ body: code.code });
    //     })
    //     .catch((error) => {
    //       reject({ status: 400, message: error.message });
    //     });
    // });
  }

  asyncUpdatePassword(password: string) {
    return new Promise<IResponseBody>((resolve, reject) => {
      updatePassword(this.user, password)
        .then((credential: any) => {
          console.log(credential);
          resolve({
            status: 200,
            body: credential,
            message: "Cambiar password exitosamente",
          });
        })
        .catch((error) => {
          reject({ status: 400, message: error.message });
        });
    });
  }

  async login2(): Promise<IResponseBody> {
    return new Promise<IResponseBody>((resolve, reject) => {
      const provider = new GoogleAuthProvider();

      signInWithRedirect(this.auth, provider)
        .then((result) => {
          resolve({
            status: 200,
            message: "Autenticado satisfactoriamente",
          });
        })
        .catch((error) => {
          reject({
            status: 400,
            message: error,
          });
        });

      // signInWithEmailAndPassword(this.auth, login.email, login.password)
      //   .then((userCredential) => {
      //     const user = userCredential.user
      //     resolve({ status: 200, body: user, message: 'Login exitosamente' })
      //   })
      //   .catch((error) => {
      //     reject({ status: 400, message: error.message })
      //   })
    });
  }

  loginWithPopup() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider).then((result) => {
      console.log(result);
    });

    // The signed-in user info.
    //const user = result.user;
    // This gives you a Facebook Access Token.
    //const credential = provider.credentialFromResult(auth, result);
    //const token = credential.accessToken;
  }

  getUserInformation() {
    return getAdditionalUserInfo(this.userCredential);
  }

  async sendPasswordResetMail(email: string) {
    const auth = getAuth(app);
    await sendPasswordResetEmail(auth, email);
  }

  sendCodeEmail(email: string): string {
    const generator = new CodeGenerator();
    const pattern = "#";
    const howMany = 6;
    const options = {};
    // Generate an array of random unique codes according to the provided pattern:
    const codes = generator.generateCodes(pattern, howMany, options);
    const code = codes.reduce((acc: any, code: any) => {
      return (acc += code);
    }, "");
    console.log(code);
    console.log(codes);
    const mailOptions = {
      from: "jsantana@soaint.com",
      to: email,
      subject: "Nodemailer Project",
      text: "Este es el codigo de verificacion: " + code,
    };

    transporter.sendMail(mailOptions, function (err: any, data: any) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Email sent successfully");
      }
    });

    return code;
  }

  verifyCode(code: string, verificationCode: ITwoStepCode): boolean {
    const now = Math.floor(Date.now() / 1000);
    const myCode = Math.floor(verificationCode.creation / 1000);
    if (now - myCode > 180) {
      throw new Error("El token de verificación ha expirado");
    }

    if (code != verificationCode.code) {
      throw new Error("El código introducido es incorrecto");
    }

    return true;
  }
}

export default new LoginService();
