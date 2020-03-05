# [REST-Docs](https://github.com/victor-valencia/rest-docs)

RESTful HTTP client library + Docs to test API REST.

![API](resources/img/api_index.png)

## Table of contents
- [Install](#install)
- [Usage](#usage)
- [Run](#run)
- [Result](#result)
- [Author](#author)
- [License](#license)

## Install

```bash
npm install rest-docs
```

## Usage

```javascript
// server.js
const rest_docs = require('rest-docs');
var rest = new rest_docs();

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

## Run

```bash
node server.js
```

## Result
API Docs:

* GET /api/docs

![API](resources/img/api_index.png)

API Test:

![API](resources/img/api_test.png)

## Author

@[victor-valencia](https://github.com/victor-valencia).

## License

Licensed under the MIT license.