import { Request, Response } from "express";

export interface IDocuSignController {
  documentDownload(request: Request, response: Response): Promise<void>;
  getDocumentList(request: Request, response: Response): Promise<any>;
  getEnvelope(request: Request, response: Response): Promise<any>;
  sendEnvelope(request: Request, response: Response): Promise<any>;
  sendWithWorkFlow(request: Request, response: Response): Promise<any>;
  reassignEnvelopRecipient(request: Request, response: Response): Promise<any>;
}
