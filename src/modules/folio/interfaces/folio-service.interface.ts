import { IFolio } from "./folio.interface";

export interface IFolioService {
    getFolios(): Promise<IFolio[]>;
}