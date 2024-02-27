import { EnvelopesApi } from "docusign-esign";
import { IDocuSignToken } from "./docu-sign-token.interface";

export interface IDocuSignConnector {
     docuSignCreateEnvelopeApi(): Promise<EnvelopesApi>;
     getDocuSignToken(): Promise<IDocuSignToken>;
}