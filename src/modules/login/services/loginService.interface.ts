export interface ILoginService{
    login (body: any): Promise<any>;
    login2 (body: any): Promise<any>;
    verifyToken(token: string, tokenVerify: string): Promise<any>;
}