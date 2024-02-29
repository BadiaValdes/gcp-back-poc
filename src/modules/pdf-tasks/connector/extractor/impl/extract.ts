import { PDFExtract, PDFExtractOptions, PDFExtractText } from "pdf.js-extract";
import { IExtractText } from "../extract.interface";

class ExtractText implements IExtractText {
  async getTextFromPdf(
    uri: string,
    text: string
  ): Promise<{ content: PDFExtractText; page: number }[]> {
    const pdfExtract = new PDFExtract();
    const contentArray: {
      content: PDFExtractText;
      page: number;
    }[] = [];
    const options: PDFExtractOptions = {
      firstPage: 1,
    };
    const extract = await pdfExtract.extract(uri, options);
    extract.pages.forEach((page, index) => {
      for (const content of page.content) {
        if (content.str == text) {
          console.log(content);
          contentArray.push({
            content: content,
            page: index,
          });
        }
      }
    });

    return contentArray;
  }
}

export default new ExtractText();
