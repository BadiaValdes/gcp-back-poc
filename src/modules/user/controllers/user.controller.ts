import { Request, Response } from "express";
import { bodyMessages, responseBodyBase } from "../../../config/const";
import userService from "../services/imp/user.service";
import { IUserService } from "../services/user.interface.service";

class UserController {
    private userServiceInstance: IUserService;

    constructor(){
        this.userServiceInstance = userService;
    }

    async getUserInfo(req: Request, res: Response): Promise<Response>{

        const responseBody = {...responseBodyBase}

        try {
            responseBody.body = await this.userServiceInstance.getUserInfo(req.body.email);
            responseBody.message = bodyMessages.successfulUserData;
        } catch (error) {
            responseBody.message = error.message
        }

        return res.status(responseBody.status).send(responseBody)
    }

    async updateUserInfo(req: Request, res: Response): Promise<Response>{
        const responseBody = {...responseBodyBase}

        try {
             await this.userServiceInstance.setUserInfo(req.body);
            responseBody.message = bodyMessages.successfulUserUpdate;
        } catch (error) {
            responseBody.message = error.message
        }

        return res.status(responseBody.status).send(responseBody)
    }
}

export default new UserController();