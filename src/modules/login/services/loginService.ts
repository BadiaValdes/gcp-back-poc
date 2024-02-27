import { ILoginService } from "./loginService.interface";

import {
  signInWithEmailAndPassword,
  getAuth,
  User,
  updatePassword,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
  UserCredential,
  signInWithRedirect,
  sendPasswordResetEmail,
  PhoneMultiFactorGenerator,
} from "firebase/auth";
import { app, firebaseAdmin } from "../../../helpers/init-firebase";
import { codeResponse, successResponse } from "src/helpers/responseType";
import qrcode from "qrcode";
import { transporter } from "../../../helpers/email";
import { IResponseBody } from "src/interfaces/response.interface";
import { ITwoStepCode } from "src/interfaces/two-step-code.interface";
import { response } from "express";
import { rejects } from "assert";
import { DB_DUMMY } from "../../../helpers/db-dummy";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { bodyMessages, httpCode } from "src/config/const";
var CodeGenerator = require("node-code-generator");

class LoginService implements ILoginService {
  // eslint-disable-line
  res: any;

  auth = getAuth(app);
  user: User;
  userCredential: UserCredential;
  // secret: GeneratedSecret;

  async login(email: string, password: string): Promise<successResponse> {
    const login = {
      email: email,
      password: password,
    };

    return new Promise<successResponse>((resolve, reject) => {
      signInWithEmailAndPassword(this.auth, login.email, login.password)
        .then((userCredential) => {
          this.userCredential = userCredential;
          this.user = userCredential.user;
          console.log(this.user);

          resolve({
            status: 200,
            body: userCredential,
            message: bodyMessages.successfulLogin,
          });
        })
        .catch((error: any) => {
          reject({ status: httpCode.BAD_REQUEST, message: error });
        });
    });
  }

  asyncUpdatePassword(password: string) {
    return new Promise<IResponseBody>((resolve, reject) => {
      updatePassword(this.user, password)
        .then((credential: any) => {
          console.log(credential);
          resolve({
            status: 200,
            body: credential,
            message: bodyMessages.successfulPasswordChange,
          });
        })
        .catch((error) => {
          reject({ status: 400, message: error.message });
        });
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

    if (verificationCode.count > 3) {
      throw new Error(bodyMessages.codeMaxAttempt);
    }

    if (now - myCode > 180) {
      throw new Error(bodyMessages.tokenExpired);
    }

    if (code != verificationCode.code) {
      verificationCode.count += 1;
      throw new Error(bodyMessages.wrongCode);
    }

    console.log(verificationCode);

    return true;
  }

  async getUser(email: string): Promise<UserRecord> {
    return await firebaseAdmin.auth().getUserByEmail(email);
  }

  async setPhone2MFA(
    email: string,
    phoneNumber: string | undefined
  ): Promise<boolean> {
    let user = await firebaseAdmin.auth().getUserByEmail(email);

    user = await firebaseAdmin.auth().updateUser(user.uid, {
      phoneNumber: phoneNumber,
      multiFactor: {
        enrolledFactors: phoneNumber
          ? [
              {
                phoneNumber: phoneNumber,
                displayName: "Work phone",
                factorId: "phone",
              },
            ]
          : null,
      },
    });

    // await firebaseAdmin.auth().createUser({
    //   displayName: "Jose Emilio",
    //   email: "jebv.informatico@gmail.com",
    //   password: "0987654",
    //   phoneNumber: "+5358186830",
    //   uid: "jebv.informatico@gmail.com",
    //   multiFactor: {
    //     enrolledFactors: [
    //       {
    //         phoneNumber: "+16505551234",
    //         displayName: "Work phone",
    //         factorId: "phone",
    //       },
    //     ],
    //   },
    // });

    // const mail = await firebaseAdmin.auth().generateEmailVerificationLink("jebv.informatico@gmail.com")

    // const mailOptions = {
    //   from: "jsantana@soaint.com",
    //   to: "jebv.informatico@gmail.com",
    //   subject: "Bienvenido a VITALMEX",
    //   text: mail,
    // };

    // transporter.sendMail(mailOptions, function (err: any, data: any) {
    //   if (err) {
    //     console.log("Error " + err);
    //   } else {
    //     console.log("Email sent successfully");
    //   }
    // });

    return !!user.multiFactor;
  }
}

export default new LoginService();
