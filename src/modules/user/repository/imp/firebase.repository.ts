import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { firebaseAdmin } from "../../../../helpers/init-firebase";
import { IFirebaseRepository } from "../firebase.interface.repository";

class FirebaseRepository implements IFirebaseRepository {
  getUser(email: string): Promise<UserRecord> {
    return firebaseAdmin.auth().getUserByEmail(email);
  }

  updateUser(userData: UserRecord): Promise<void> {
    const { uid, multiFactor, ...updateData } = userData;
    firebaseAdmin.auth().updateUser(userData.uid, {
      ...updateData,
    });
    return;
  }
}

export default new FirebaseRepository();
