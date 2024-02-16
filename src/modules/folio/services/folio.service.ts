import { IFolioService } from "../interfaces/folio-service.interface";
import { IFolio } from "../interfaces/folio.interface";
import { FOLIOS_MOCKS } from "../mock/folios.mock";

class FolioService implements IFolioService {
    getFolios(): Promise<IFolio[]> {
        return new Promise((resolve, rejects) => {
            console.log(FOLIOS_MOCKS)
            resolve(FOLIOS_MOCKS)
        })
    }
}

export const folioService: IFolioService = new FolioService();