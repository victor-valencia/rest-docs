# [REST-Docs](https://github.com/victor-valencia/rest-docs)

Example with `SQLite3`.

![API](/resources/img/SQLite3/api.png)

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

- Install `SQLite3` database library.

```bash
npm i sqlite3 --save
```

## Database

```bash
# Create Database `zoo`
$ sqlite3 zoo.db

# Create Table `animals`
sqlite> CREATE TABLE IF NOT EXISTS `animals` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `name` TEXT NOT NULL DEFAULT '',
  `created` TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` BOOLEAN NOT NULL DEFAULT '0'  
);
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

rest.startDBServer('sqlite', {  
  filename: 'C:/Sqlite/zoo.db' //<-- YOUR_DATABASE_NAME
});

const api_config = {
  base: '/api',
  pages: {
    docs: true, //<-- Expose PAGE: /{{base}}/docs
    monitor: true //<-- Expose PAGE: /{{base}}/monitor
  },
  routes: {
    tb: [
      {      
        table: 'animals', //<-- YOUR_TABLE_NAME
        event: 'ANIMAL', //<-- YOUR_EVENT_NAME 
        methods: ['GET', 'POST', 'PUT', 'DELETE'], //<-- YOUR_METHODS
        //Used only by methods 'POST' and 'PUT'
        columns: [
            {name: 'id', primary: true},
            {name: 'name'}
        ]
      }
    ]
  } 
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

![API](/resources/img/SQLite3/api.png)

## Test API

* GET `/api/animals`

![API](/resources/img/SQLite3/api_get_all.png)

* GET `/api/animals/:id`

![API](/resources/img/SQLite3/api_get_id.png)

* POST `/api/animals`

![API](/resources/img/SQLite3/api_post.png)

* PUT `/api/animals/:id`

![API](/resources/img/SQLite3/api_put.png)

* DELETE `/api/animals/:id`

![API](/resources/img/SQLite3/api_delete.png)

## Author

@[victor-valencia](https://github.com/victor-valencia).

## License

Licensed under the [MIT license](/LICENSE).