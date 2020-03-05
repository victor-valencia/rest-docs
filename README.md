# REST-Doc

RESTful HTTP client library + Docs to test API REST.

## Install

```bash
npm install rest-doc
```

## Usage

```javascript
// server.js
const rest_doc = require('rest-doc');
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
    password: '',
    database: 'database'    
  }

}

rest.setConfig(config)

rest.startServer()

const api = {

  base: '/api/',
  routes: [
    {      
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
```
API Docs:

* GET /api/docs

API:

* GET /api/doctors    
* GET /api/doctors/:id

## Run

```bash
node server.js
```

## Author

@[victor-valencia](https://github.com/victor-valencia).

## License

Licensed under the MIT license.