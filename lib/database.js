"use strict";

var mysql = require('mysql');

class Database {

  static getConnection(config) {

    return new Promise( (resolve, reject) => {
  
      var pool = mysql.createPool(config);

      pool.getConnection((err, connection) => {

        try {
          if (connection) {            
            resolve({"status": "SUCCESS", "msg": "MySQL Connected POOL :: threadId => " + connection.threadId + ".", "con": pool});
            connection.release();
          }
        }
        catch (err) {
          reject({"status": "FAILED", "msg": `MySQL error. ${err}`});
        }

        resolve({"status": "FAILED", "msg": "Error connecting to MySQL."});
        
      });

    })
  
  }

}

module.exports = Database