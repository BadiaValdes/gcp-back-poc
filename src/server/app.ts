import express from "express";
import cors from "cors";
import { ServerInterface } from "./app.interface";
import baseRouter from "../modules/baseRouter";
import multer from "multer";
import { transporter } from "../helpers/email";
import authMiddleware from "../middleware/auth.middleware";

// swagger
import * as swagger from "swagger-express-ts";
import { SwaggerDefinitionConstant } from "swagger-express-ts";

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

    // Swagger

    /*transporter.sendMail(mailOptions, function(err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Email sent successfully");
      }
    });*/


    const upload = multer();
    // Swagger
    app.use('/api-docs/swagger', express.static('swagger'));
    app.use('/api-docs/swagger/assets', express.static('node_modules/swagger-ui-dist'));
    app.use(swagger.express({
      definition : {
        info : {
            title : "My api" ,
            version : "1.0"
        } ,
        externalDocs : {
            url : "My url"
        },
        basePath: '/api/v1'
        // Models can be defined here
    }
    }))
    // End swagger

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
