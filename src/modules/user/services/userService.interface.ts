import { IUser } from "../interfaces/user.interface";

export interface IUserService{
    getRandomTest (): Promise<any>;
    getUsers (): Promise<any>;
    createUsers(req: IUser): Promise<any>;
}