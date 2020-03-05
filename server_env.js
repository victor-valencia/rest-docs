const config = require('./config.js');
// const api = require('./api.js');

const rest_doc = require('./lib/rest.js');
var rest = new rest_doc();

rest.setConfig(config)
rest.startServer()

const api = {

  base: '/api/',
  routes: [
    {
      // Médicos ['GET']
      table: 'doctors',
      event: 'DOCTOR',
      methods: ['GET'],
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