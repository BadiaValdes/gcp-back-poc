import { SessionsLocal } from "../connector/session.connector";
import { ISessions } from "../sessions.interface";

class SessionsServiceImpl implements ISessions {
  setValue(key: string, value: any): void {
    SessionsLocal.getInstance().addData(key, JSON.stringify(value));
  }
  getValue(key: string): any {
    return SessionsLocal.getInstance().getValue(key)
      ? JSON.parse(SessionsLocal.getInstance().getValue(key))
      : undefined;
  }
  removeValue(key: string): void {
    SessionsLocal.getInstance().removeData(key);
  }
}

export default new SessionsServiceImpl();
