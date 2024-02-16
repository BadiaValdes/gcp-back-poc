import express from "express";
import cors from "cors";
import { ServerInterface } from "./app.interface";
import baseRouter from "../modules/baseRouter";
import multer from "multer";
import { transporter } from "../helpers/email";
import authMiddleware from "../middleware/auth.middleware";
import { serve, setup } from "swagger-ui-express";
import json from "../../swagger/swagger-output.json";

class Server implements ServerInterface {
  // eslint-disable-line

  async server(): Promise<express.Application> {
    const app = express();
    let mailOptions = {
      from: "jsantana@soaint.com",
      to: "jsantana@soaint.com",
      subject: "Nodemailer Project",
      text: "Hi from your nodemailer project",
    };

    /*transporter.sendMail(mailOptions, function(err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Email sent successfully");
      }
    });*/

    // Swagger
    app.use("/doc", serve, setup(json));

    const upload = multer();
    app.use(express.json());
    app.use("/api/v1/folios", authMiddleware);
    app.use(cors());
    app.use(express.urlencoded({ extended: true }));
    app.use(upload.single("file"));
    app.use("/api/v1", baseRouter.routes); //setting up base route
    // define a route handler for the default home page
    app.get("/", (req, res) => {
      res.send("Welcome to express-create application! ");
    });
    return app;
  }
}

export default new Server();
