const express= require('express');
const shortid = require("short-id");
const Router= express.Router();
const jwt = require("jsonwebtoken");
const secretKey = "privatekey";
const db = require("../models/dbconnection");
const postUrldata= require('../controllers/addurl');



Router.post("/postUrl",postUrldata);

  module.exports= Router;
  