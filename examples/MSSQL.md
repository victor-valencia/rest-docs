# [REST-Docs](https://github.com/victor-valencia/rest-docs)

Example with `MSSQL`.

![API](/resources/img/MSSQL/api.png)

## Table of contents
- [Install](#install)
- [Server](#server)
- [Result](#result)
- [Test API](#test-api)
- [Author](#author)
- [License](#license)

## Install

- Install `rest-docs` library.

```bash
npm i rest-docs --save
```

- Install `MSSQL` database library.

```bash
npm i mssql --save
```

## Database

```bash
-- Create Database `shop`
CREATE DATABASE shop
GO

-- Create Table `products`
CREATE TABLE products (
  id INT PRIMARY KEY IDENTITY (1, 1),
  name VARCHAR(255) NOT NULL DEFAULT '',
  created DATETIME NOT NULL,
  modified DATETIME NOT NULL,
  deleted TINYINT NOT NULL DEFAULT '0'  
)
GO
```

## Server

```javascript
// server.js
const rest_docs = require('rest-docs');
var rest = new rest_docs();

rest.startServer({
  ip: '127.0.0.1', //<-- YOUR_SERVER_IP
  port: '8080', //<-- YOUR_SERVER_PORT
  compression: 'gzip' //<-- YOUR_COMPRESSION_STRATEGY
})

rest.startDBServer('mssql', {
  host: 'localhost\\MSSQLSERVER', //<-- YOUR_DATABASE_HOST
  port: 1433, //<-- YOUR_DATABASE_PORT
  user: 'sa', //<-- YOUR_DATABASE_USER
  password: '', //<-- YOUR_DATABASE_PASSWORD
  database: 'shop' //<-- YOUR_DATABASE_NAME
});

const api_config = {
  base: '/api',
  pages: {
    docs: true, //<-- Expose PAGE: /{{base}}/docs
    monitor: true //<-- Expose PAGE: /{{base}}/monitor
  },
  routes: [
    {      
      table: 'products', //<-- YOUR_TABLE_NAME
      event: 'PRODUCT', //<-- YOUR_EVENT_NAME 
      methods: ['GET', 'POST', 'PUT', 'DELETE'], //<-- YOUR_METHODS
      //Used only by methods 'POST' and 'PUT'
      columns: [
          {name: 'id', primary: true},
          {name: 'name'}
      ]
    }
  ]  
}

rest.buildRoutes(api_config)
```

Run

```bash
node server.js
# PAGES: {
#   api: 'http://127.0.0.1:8080/api',
#   docs: 'http://127.0.0.1:8080/api/docs',
#   monitor: 'http://127.0.0.1:8080/api/monitor'    
# }
# App listening at http://127.0.0.1:8080
```

## Result

* GET `/api/docs`

![API](/resources/img/MSSQL/api.png)

## Test API

* GET `/api/products`

![API](/resources/img/MSSQL/api_get_all.png)

* GET `/api/products/:id`

![API](/resources/img/MSSQL/api_get_id.png)

* POST `/api/products`

![API](/resources/img/MSSQL/api_post.png)

* PUT `/api/products/:id`

![API](/resources/img/MSSQL/api_put.png)

* DELETE `/api/products/:id`

![API](/resources/img/MSSQL/api_delete.png)

## Author

@[victor-valencia](https://github.com/victor-valencia).

## License

Licensed under the [MIT license](/LICENSE).