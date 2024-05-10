const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const db = require("./models/dbconnection");
const shortid = require("short-id");
const jwt = require("jsonwebtoken");
const authenticateUser = require("./middlewares/authmiddleware");
const posturl = require("./routes/addUrl");
const clickshortUrl = require("./routes/retriveshortUrl");
const getSpecifUrls = require("./routes/getspecificUrls");
require('dotenv').config();


const swaggerjdc = require("swagger-jsdoc");
const swagger_ui = require("swagger-ui-express");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("client");
});

///swagger documentation
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Url shrtener",
      version: "1.0.0",
      description: "API documentation for the for Url Shortner application",
    },
    servers: [
      {
        url: "http://localhost:2000",
      },
    ],
  },
  apis: ["./app.js"],
};

const swaggerSpec = swaggerjdc(options);

app.use("/api/doc", swagger_ui.serve, swagger_ui.setup(swaggerSpec));


/**
 * @swagger
 * /postUrl:
 *   post:
 *     summary: This API is used for URL storage
 *     description: This API stores the URL entered by the user to the database
 *     responses:
 *       200:
 *         description: To test the URL post method
 */
app.use("/", posturl);
app.use("/", clickshortUrl);
app.use("/",getSpecifUrls);

app.listen(2000, () => {
  console.log("Server is running on port 2000...");
});
