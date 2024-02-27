import { AccountsApi, EnvelopesApi } from "docusign-esign";
import { IDocuSignConnector } from "../interfaces/docu-sign-connector.interface";
import { DocuSign } from "./singleton/docu-sign";
import { IDocuSignToken } from "../interfaces/docu-sign-token.interface";
import { readFileSync } from "fs";


export class DocuSignConnector implements IDocuSignConnector {
    private static docuSignService: IDocuSignConnector;
  private constructor() {
    console.log("Aqui");
  }

  public static getDocuSignConnector(){
    if(!this.docuSignService){
        DocuSignConnector.docuSignService = new DocuSignConnector();
    } 

    return DocuSignConnector.docuSignService;
  }

  async docuSignCreateEnvelopeApi(): Promise<EnvelopesApi> {
    const token = await this.getDocuSignToken(); // Get token
    this.docuSignSetToken(token); // Add token to docuSign instance

    return new EnvelopesApi(DocuSign.getDocuSign());
  }

  async getDocuSignToken(): Promise<IDocuSignToken> {
    const USER_ID = process.env.USER_ID; // user id
    const SCOPE = ["signature"]; // Scope for petition
    const JWT_LIFE_SEC = 10 * 60; // 10 minutes
    const INTEGRATION_KEY = process.env.INTEGRATION_KEY; // integration key

    const result = await DocuSign.getDocuSign().requestJWTUserToken(
      INTEGRATION_KEY,
      USER_ID,
      SCOPE,
      readFileSync("./private.key"),
      JWT_LIFE_SEC
    );

    return {
      accessToken: result.body.access_token,
      tokenExpiration: "test",
    };
  }

  private docuSignSetToken(token: any) {
    DocuSign.getDocuSign().addDefaultHeader(
      "Authorization",
      "Bearer " + token.accessToken
    ); // Add token to docuSign instance
  }
}
