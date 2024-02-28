import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { bodyMessages } from "src/config/const";
import { IUserData } from "src/interfaces/user/user-data.interface";
import { IFirebaseRepository } from "../../repository/firebase.interface.repository";
import firebaseRepository from "../../repository/imp/firebase.repository";
import { IUserService } from "../user.interface.service";

class UserService implements IUserService {
  firebaseRepository: IFirebaseRepository;

  constructor() {
    this.firebaseRepository = firebaseRepository;
  }

  async getUserInfo(email: string): Promise<UserRecord> {
    try {
      return await this.firebaseRepository.getUser(email);
    } catch (error) {
      throw Error(bodyMessages.mailDoesntExist);
    }
  }

  async setUserInfo(userData: IUserData): Promise<boolean> {
    try {
      const user = {...await this.firebaseRepository.getUser(userData.email)};
      for (const key in userData) {
        if (Object.prototype.hasOwnProperty.call(user, key)) {
            user[key as keyof IUserData] = userData[key as keyof IUserData];
        }
      }
      await this.firebaseRepository.updateUser(user as UserRecord);
      return true;
    } catch (error) {
      throw Error(bodyMessages.updateUserError);
    }
  }
}

export default new UserService();
