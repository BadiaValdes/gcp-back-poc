import { readFileSync } from "fs";
import {
  Document,
  Signer,
  SignHere,
  Recipients,
  EnvelopeDefinition,
} from "docusign-esign";


export function makeDocuSignEnvelope() {
  try {
    // This part will be used with a uploaded file
    const DOC = readFileSync("./test_file.pdf"); // Reading file
    const base64File = Buffer.from(DOC).toString("base64"); // Convert to base 64
    // This ends with the uploaded file converted in base 64

    // Create document object
    const document: Document = {
      documentBase64: base64File,
      documentId: "1",
      fileExtension: "pdf",
      name: "test_file",
    };

    // Signers for the document
    const signer: Signer = {
      email: "jebadia@soaint.com",
      name: "Emilio Badia",
      recipientId: "1",
    };

    // SignHere document box
    const signHere: SignHere = {
      documentId: "1",
      name: "firma",
      pageNumber: "1",
      recipientId: "1", // Is required
      tabLabel: "FirmaMe",
      tooltip: "Presione para firmar este documento",
      yPosition:'200',
      xPosition:'100',
      
   };

    signer.tabs = {
      signHereTabs: [signHere],
      fullNameTabs: []
    };

    // The persons who going to receive the message
    const recipient: Recipients = {
      signers: [signer],
      carbonCopies: [
        {
          email: "jebv.informatico@gmail.com",
          name: "Emilio",
          recipientId: "2",
        },
      ],
    };

    // create the envelop
    const envelop: EnvelopeDefinition = {
      documents: [document],
      emailSubject: "Prueba de firma de datos 2",
      recipients: recipient,
      status: "sent",
      allowReassign: 'true'
    };


    return envelop;
  } catch (e) {
    console.log(e);
  }
}
