import { ApiClient } from "docusign-esign";

export class DocuSign {
  private static docuSignInstance: ApiClient;

  private constructor() {
    console.log("Constructor");
  }

  public static getDocuSign() {
    if(!DocuSign.docuSignInstance){
        DocuSign.docuSignInstance = new ApiClient();
        DocuSign.docuSignInstance.setBasePath(process.env.BASE_PATH);
    } 

    return DocuSign.docuSignInstance;
  }
}
