import { UserRecord } from "firebase-admin/lib/auth/user-record";

export interface IFirebaseRepository {
    getUser(email: string): Promise<UserRecord>;
    updateUser(userData: UserRecord): Promise<void>;
}