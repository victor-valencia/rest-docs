const env = require('dotenv').config();

// console.log("NODE_ENV='"+process.env.NODE_ENV+"'");

// console.log(env.parsed)

module.exports = {

  SERVER: {
    IP: process.env.IP,
    PORT: process.env.PORT,
    NAME: process.env.APP_URL
  },
  DATABASE: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    timezone: 'UTC+0'
    // dateStrings: true
  }

}
