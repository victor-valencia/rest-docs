'use strict'

const env = require('dotenv').config();

// console.log("NODE_ENV='"+process.env.NODE_ENV+"'");

// console.log(env.parsed)

module.exports = {

  ip: process.env.IP || 'localhost',
  port: process.env.PORT || 8000,
  name: process.env.APP_URL || 'localhost:8000',
  origins: process.env.WS || 'http://localhost:4200',
  compression: process.env.COMPRESSION || ''

}
