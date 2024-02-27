import { Request, Response } from "express";
import { docuSignService } from "../service/docu-sign.service";
import { IDocuSignController } from "../interfaces/docu-sign-controller.interface";

class DocuSignController implements IDocuSignController {
  private docuSignInstanceService;

  constructor() {
    this.docuSignInstanceService = docuSignService;
  }

  async documentDownload(request: Request, response: Response): Promise<void> {
    try {
      const result = await this.docuSignInstanceService.documentDownload(
        request.body.documentId,
        request.body.envelopeId
      );
      response.send({
        status: "200",
        body: result,
      });
    } catch (e) {
      response.send({
        status: "400",
        message: "Algo salio mal descargando el archivo",
        body: {},
      });
    }
  }

  async getDocumentList(request: Request, response: Response): Promise<any> {
    try {
      const result = await this.docuSignInstanceService.getDocumentList(
        request.body.envelopeId
      );
      response.send({
        status: "200",
        body: result,
      });
    } catch (e) {
      response.send({
        status: "400",
        message: "Algo salio mal en la obtención de la lista de documentos",
        body: {},
      });
    }
  }

  async getEnvelope(request: Request, response: Response): Promise<any> {
    try {
      const result = await this.docuSignInstanceService.getEnvelope(
        request.params.id
      );
      response.send({
        status: "200",
        body: result,
      });
    } catch (e) {
      response.send({
        status: "400",
        message: "Algo salio mal obteniendo la información del envelope",
        body: {},
      });
    }
  }

  async sendEnvelope(request: Request, response: Response) {
    try {
      const result = await this.docuSignInstanceService.sendEnvelope();
      response.send({
        status: "200",
        body: result,
      });
    } catch (e) {
      response.send({
        status: "400",
        message: "Algo salio mal en el envío del envelope",
        body: {},
      });
    }
  }

  async sendWithWorkFlow(request: Request, response: Response) {
    try {
      const result = await this.docuSignInstanceService.sendWithWorkFlow();
      response.send({
        status: "200",
        body: result,
      });
    } catch (e) {
      response.send({
        status: "400",
        message: "Algo salio mal enviando el workflow",
        body: {},
      });
    }
  }

  async reassignEnvelopRecipient(request: Request, response: Response) {
    try {
      const result = await this.docuSignInstanceService.reassignEnvelope();
      response.send({
        status: "200",
        body: result,
      });
    } catch (e) {
      response.send({
        status: "400",
        message: "Algo salio mal enviando el workflow",
        body: {},
      });
    }
  }
}

export const docuSignControllerInstance = new DocuSignController();
