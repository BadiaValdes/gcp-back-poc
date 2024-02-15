import { Storage } from "@google-cloud/storage";
import Multer from "multer";

export const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // No larger than 5mb, change as you need
  },
});

let projectId = ""; // Get this from Google Cloud
let keyFilename = ""; // Get this from Google Cloud -> Credentials -> Service Accounts
const storage = new Storage({
  projectId,
  keyFilename,
});
export const bucket = storage.bucket(""); // Get this from Google Cloud -> Storage