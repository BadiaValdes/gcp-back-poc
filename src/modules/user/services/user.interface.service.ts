import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { IUserData } from "../../../interfaces/user/user-data.interface";

export interface IUserService {
    getUserInfo(email: string): UserRecord;
    setUserInfo(userData: IUserData): boolean;
}