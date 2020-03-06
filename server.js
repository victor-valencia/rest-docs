// const config = require('./config.js');
// const api = require('./api.js');

const rest_doc = require('./lib/rest.js');
var rest = new rest_doc();

const config = {

  SERVER: {
    IP: 'localhost',
    PORT: '8000',
    NAME: 'localhost:8000'
  },
  DATABASE: {
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'medic_app'    
  }

}

rest.setConfig(config)
rest.startServer()

const api = {

  base: '/api',
  routes: [
    {
      // Médicos ['GET']
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

rest.buildRoutes(api)