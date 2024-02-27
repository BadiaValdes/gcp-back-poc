export interface IDocuSignService {
  documentDownload(documentId: string, envelopeId: string): any;
  getDocumentList(envelopeId: string): Promise<any>;
  getEnvelope(envelopeId: string): Promise<any>;
  sendEnvelope():any;
  sendWithWorkFlow():any;
  reassignEnvelope():Promise<any>;
}
