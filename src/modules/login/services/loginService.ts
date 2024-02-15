import { ILoginService } from './loginService.interface'

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
} from 'firebase/auth'
import { app } from '../../../helpers/init-firebase'
import { successResponse } from 'src/helpers/responseType'

class LoginService implements ILoginService {
  // eslint-disable-line
  res: any

  auth = getAuth(app)
  user: User;
  userCredential: UserCredential;

  async login(body: any): Promise<any> {
    return new Promise<successResponse>((resolve, reject) => {
      const login = {
        email: body.email,
        password: body.password,
      }
      signInWithEmailAndPassword(this.auth, login.email, login.password)
        .then((userCredential) => {
          this.userCredential = userCredential;
          this.user = userCredential.user
          resolve({ status: 200, body: userCredential, message: 'Login exitosamente' })
        })
        .catch((error) => {if (error.code == 'auth/multi-factor-auth-required') {
          // The user is a multi-factor user. Second factor challenge is required.
          const resolver = getMultiFactorResolver(this.auth, error);
          reject({ status: 400, message: resolver })
          // ...
      } else if (error.code == 'auth/wrong-password') {
          // Handle other errors such as wrong password.
      }
          reject({ status: 400, message: error.message })
        })
    })
  }

  asyncUpdatePassword (password: string) {
    console.log(password)
    return new Promise<successResponse>((resolve, reject) => {
      updatePassword(this.user, password)
        .then((credential:any) => {
          console.log(credential)
          resolve({ status: 200, body: credential, message: 'Cambiar password exitosamente' })
        })
        .catch((error) => {
          reject({ status: 400, message: error.message })
        })
    })
  } 

  async login2(body: any): Promise<any> {
    return new Promise<successResponse>((resolve, reject) => {
    
      console.log("HERE")

      const provider = new GoogleAuthProvider();

      signInWithRedirect(this.auth, provider).then(result => {
        console.log(result)
        resolve({ status: 200, body: "HOLA", message: 'Login exitosamente' })
      }).catch((error) => {
        reject({ status: 400, message: error.message })
      })

      // signInWithEmailAndPassword(this.auth, login.email, login.password)
      //   .then((userCredential) => {
      //     const user = userCredential.user
      //     resolve({ status: 200, body: user, message: 'Login exitosamente' })
      //   })
      //   .catch((error) => {
      //     reject({ status: 400, message: error.message })
      //   })
    })
  } 

  loginWithPopup () {
    const provider = new GoogleAuthProvider();
     signInWithPopup(this.auth, provider).then((result) => {
       console.log(result)
     });
 
  // The signed-in user info.
  //const user = result.user;
  // This gives you a Facebook Access Token.
  //const credential = provider.credentialFromResult(auth, result);
  //const token = credential.accessToken;
  }

  getUserInformation () {
    return getAdditionalUserInfo(this.userCredential);
  }

  multiFactor () {
    const recaptchaVerifier = new RecaptchaVerifier(this.auth, '');
multiFactor(this.user).getSession()
    .then(function (multiFactorSession) {
        // Specify the phone number and pass the MFA session.
        const phoneInfoOptions = {
            phoneNumber: "+59898335948",
            session: multiFactorSession
        };

        const phoneAuthProvider = new PhoneAuthProvider(this.auth);

        // Send SMS verification code.
        return phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);
    }).then(function (verificationId) {
        // Ask user for the verification code. Then:
        const cred = PhoneAuthProvider.credential(verificationId, "1234");
        const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

        // Complete enrollment.
        return multiFactor(this.user).enroll(multiFactorAssertion, 'My second factor');
    });
  }
}

export default new LoginService()
