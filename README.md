# [REST-Docs](https://github.com/victor-valencia/rest-docs)

RESTful HTTP client library + Docs to test your API REST.

![API](resources/img/api.png)

## Table of contents
- [Install](#install)
- [Usage](#usage)
- [Run](#run)
- [Result](#result)
- [Test API](#test)
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

  base: '/api',
  routes: [
    {      
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
```

## Run

```bash
node server.js
```

## Result

* GET /api/docs

![API](resources/img/api.png)

## Test API

* GET /api/doctors

![API](resources/img/api_get_all.png)

* GET /api/doctors/:id

![API](resources/img/api_get_id.png)

* POST /api/doctors

![API](resources/img/api_post.png)

* PUT /api/doctors/:id

![API](resources/img/api_put.png)

* DELETE /api/doctors/:id

![API](resources/img/api_delete.png)

## Author

@[victor-valencia](https://github.com/victor-valencia).

## License

Licensed under the MIT license.