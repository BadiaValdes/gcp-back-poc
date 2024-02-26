import { NextFunction, Request, Response } from "express";
//import * as admin from "firebase-admin";
import { firebaseAdmin } from "../helpers/init-firebase";
const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearerToken = req.headers.authorization;

  const token = bearerToken.split(" ")[1];

  if (!token) {
    console.log("bad");
    return res.status(401).send("No se ha autenticado en la plataforma");
  }
  
  console.log("good");


  firebaseAdmin
    .auth()
    .verifyIdToken(token)
    .then((data) => {
      console.log("inside");
      console.log(data);
      next();
    })
    .catch((error) => {
      console.log(error);
      return res.status(403).send("No se puede autenticar en esta plataforma");
    });
};

export default authMiddleware;
