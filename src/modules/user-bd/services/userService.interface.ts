import { IUser } from "../interfaces/user.interface";

export interface IUserService{
    getUsers (): Promise<any>;
    createUsers (req: IUser): Promise<any>;
    updateUsers (req: IUser, id: string): Promise<any>;
    deleteUsers (id: string): Promise<any>;
}