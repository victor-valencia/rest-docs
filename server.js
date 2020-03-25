'use strict'

/*
  |--------------------------------------------------------------------------
  | EXAMPLE 1:
  |--------------------------------------------------------------------------
  |
  | Basic configuration (Explicit).
  |
  */

const rest_docs = require('./lib/rest.js');
var rest = new rest_docs();

rest.startServer({
  ip: '127.0.0.1',
  port: '8080'  
})

rest.startDBServer('mysql', {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'medic_app'    
});

const api_config = {
  base: '/api',
  routes: [
    { 
      // Doctors ['GET', 'POST', 'PUT', 'DELETE']
      table: 'doctors',
      event: 'DOCTOR',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      columns: [
          {name: 'id', primary: true},
          {name: 'name'},
          {name: 'specialty'},
          {name: 'address'},
          {name: 'photo'}
      ]
    }
  ]  
}

rest.buildRoutes(api_config)