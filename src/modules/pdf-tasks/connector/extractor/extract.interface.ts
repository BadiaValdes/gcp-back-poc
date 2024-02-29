import { PDFExtractText } from "pdf.js-extract";

export interface IExtractText {
  getTextFromPdf(
    uri: string,
    text: string
  ): Promise<
    {
      content: PDFExtractText;
      page: number;
    }[]
  >;
}
