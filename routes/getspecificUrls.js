
const express= require('express');
const Router= express.Router();
const authenticateUser= require('../middlewares/authmiddleware');
const getUrlsController= require('../controllers/getcontroler');


Router.get("/getUrls",getUrlsController);
  module.exports= Router;