const express= require('express');
const db = require("../models/dbconnection");
const Router= express.Router();
const  retrieveShortUrlController= require('../controllers/retrieveshort');
require('dotenv').config()


Router.get("/urlClicked",retrieveShortUrlController);;
  
  module.exports= Router;
  