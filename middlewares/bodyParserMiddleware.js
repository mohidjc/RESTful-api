const express = require('express');

const bodyParserMiddleware = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
};

module.exports = bodyParserMiddleware;
