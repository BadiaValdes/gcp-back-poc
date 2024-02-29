
export interface IPDFService {
  searchInPdf(text: string): Promise<void>;
}
