import { ITwoStepCode } from "src/interfaces/two-step-code.interface";

export let session: any[] = [];

export class Sessions {
  private static session: Sessions;
  private cookies: {
    [_key: string]: ITwoStepCode;
  } = {};
  private constructor() {}

  public static getInstance() {
    if (!Sessions.session) {
      Sessions.session = new Sessions();
    }

    return Sessions.session;
  }

  public addData(key: string, value: ITwoStepCode) {
    this.cookies[key] = value;
  }

  public removeData(key: string){
    delete this.cookies[key];
  }

  public getValue(key: string){
    return this.cookies[key] ?? undefined
  }
}
