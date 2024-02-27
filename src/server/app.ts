import express from "express";
import cors from "cors";
import { ServerInterface } from "./app.interface";
import baseRouter from "../modules/baseRouter";
import multer from "multer";
import authMiddleware from "../middleware/auth.middleware";

// swagger
import * as swagger from "swagger-express-ts";

// session
import  session from "express-session";
import { ITwoStepCode } from "src/interfaces/two-step-code.interface";
import { Sessions } from "../helpers/session";

declare module 'express-session' {
  interface SessionData {
    [key: string]: ITwoStepCode,
    _dummy: string
  }
}
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
    app.use("/api-docs/swagger", express.static("swagger"));
    app.use(
      "/api-docs/swagger/assets",
      express.static("node_modules/swagger-ui-dist")
    );
    app.use(
      swagger.express({
        definition: {
          info: {
            title: "My api",
            version: "1.0",
          },
          externalDocs: {
            url: "My url",
          },
          basePath: "/api/v1",
          // Models can be defined here
        },
      })
    );
    // End swagger

    // Sessions
    Sessions.getInstance();
    // End sessions

    // Middleware
    app.use(express.json());
    app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
    app.use(
      session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        //store: new session.MemoryStore(),
        //cookie: { secure: false, maxAge: 3 * 24 * 60 * 60 * 1000 },
      })
    );
    app.use("/api/v1/folios", authMiddleware);
    app.use(express.urlencoded({ extended: true }));
    app.use(upload.single("file"));
    // End Middleware

    // Routes
    app.use("/api/v1", baseRouter.routes);
    app.get("/", (req, res) => {
      res.send("Welcome to express-create application! ");
    });
    // End routes

    return app;
  }
}

export default new Server();
