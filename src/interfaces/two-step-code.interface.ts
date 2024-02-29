export interface ITwoStepCode {
    code: string,
    creation: number,
    count: number,
    verified: boolean,
    email: string,
    countLogin: number,
    loginError?: number,
    codeError?: number,
  }