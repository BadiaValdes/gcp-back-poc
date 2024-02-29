
export let session: any[] = [];

export type SessionsCookies = {
  [key: string]: string;
};

export class SessionsLocal {
  private static session: SessionsLocal;
  private cookies: SessionsCookies = {};
  private constructor() {}

  public static getInstance() {
    if (!SessionsLocal.session) {
      SessionsLocal.session = new SessionsLocal();
    }

    return SessionsLocal.session;
  }

  public addData(key: string, value: string) {
    this.cookies[key] = value;
  }

  public removeData(key: string) {
    delete this.cookies[key];
  }

  public getValue(key: string) {
    return this.cookies[key] ?? undefined;
  }
}
