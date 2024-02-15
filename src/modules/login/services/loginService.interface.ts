export interface ILoginService{
    login (body: any): Promise<any>;
    login2 (body: any): Promise<any>;
    asyncUpdatePassword(password: string): Promise<any>;
}