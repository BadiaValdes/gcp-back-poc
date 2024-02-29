import { readFileSync, writeFile } from "fs";
import { PDFDocument } from "pdf-lib";
import { IExtractText } from "../../connector/extractor/extract.interface";
import extractText from '../../connector/extractor/impl/extract';
import { IPDFService } from "../pdf.service.interfase";

class PDFService implements IPDFService {

    private readonly extractTextInstance: IExtractText = extractText;

  constructor() {}

  private async loadPdf(uri: string = "./test.pdf"): Promise<PDFDocument> {
    const file = readFileSync(uri);
    return await PDFDocument.load(file);
  }

  public async searchInPdf(text: string) {
    const pdf = await this.loadPdf();
    const pdfFirstPage = pdf.getPage(0);

    (await this.extractTextInstance.getTextFromPdf("./test.pdf", "/s1/")).forEach(
      ({ content, page }) => {
        pdf.getPages().forEach((pageData, index) => {
          if (index == page)
            pageData.drawText("FIRMA AQUI", {
              x: content.x,
              y: pdfFirstPage.getHeight() - content.y,
            });
        });
      }
    );

    writeFile(
      "dat.pdf",
      new Buffer(await pdf.saveAsBase64(), "base64"),
      function (err) {
        if (err) console.log("Error: " + err);
      }
    );
  }
}

export default new PDFService();
