import { ILoginService } from './loginService.interface'
import { onAuthStateChanged, signInWithEmailAndPassword, getAuth, User } from 'firebase/auth'
import { app } from '../../../helpers/init-firebase'
import { successResponse } from 'src/helpers/responseType'

class LoginService implements ILoginService {
  // eslint-disable-line
  res: any

  auth = getAuth(app)

  async login(body: any): Promise<any> {
    return new Promise<successResponse>((resolve, reject) => {
      const login = {
        email: body.email,
        password: body.password,
      }
      signInWithEmailAndPassword(this.auth, login.email, login.password)
        .then((userCredential) => {
          const user = userCredential.user
          resolve({ status: 200, body: user, message: 'Login exitosamente' })
        })
        .catch((error) => {
          reject({ status: 400, message: error.message })
        })
    })
  }
}

export default new LoginService()
