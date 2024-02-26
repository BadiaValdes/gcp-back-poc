import loginService from "../services/loginService";
import { ILoginService } from "../services/loginService.interface";
import { Request, Response } from "express";

class LoginController  {
    loginService: ILoginService = loginService

    async login (req: Request, res: Response) {
        const code = await this.loginService.login(req.body)
        console.log(code)
        req.session['code'] = code.body;
        console.log(req.session)
        return res.status(200).send({
            status: 200,
            message: "Login exitosamente"
        });
    }

    async verifyToken (req: Request, res: Response) {
        await this.loginService.verifyToken(req.body.token, req.session['code'])
    }
}

//await loginService.login(req.body)
export default new LoginController()