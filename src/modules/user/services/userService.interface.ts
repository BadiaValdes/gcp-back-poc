export interface IUserService{
    getRandomTest (): Promise<any>;
    getUsers (): Promise<any>;
}