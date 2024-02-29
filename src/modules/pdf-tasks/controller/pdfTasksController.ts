import { Request, Response } from "express";
import {
  httpCode,
  responseBodyBase
} from "../../../config/const";
import { IResponseBody } from "../../../interfaces/response.interface";
import pdfService from "../service/impl/pdf.service";
import { IPDFService } from "../service/pdf.service.interfase";

class PdfTasksController {
  private pdfServiceInstance: IPDFService = pdfService;

  async test1(req: Request, res: Response) {
    const responseBody: IResponseBody = { ...responseBodyBase };

    try {
     await this.pdfServiceInstance.searchInPdf('test');
    } catch (error) {
      responseBody.message = error.message;
      responseBody.status = httpCode.BAD_REQUEST;
    }

    return res.status(responseBody.status).send({
      status: responseBody.status,
      message: responseBody.message,
      body: responseBody.body,
    });
  }

 
}

//await loginService.login(req.body)
export default new PdfTasksController();
