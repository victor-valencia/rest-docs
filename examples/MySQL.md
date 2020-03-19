# [REST-Docs](https://github.com/victor-valencia/rest-docs)

Example with `MySQL` or `MariaDB`.

![API](/resources/img/mysql/api.png)

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

- Install `MySQL` database library.

```bash
npm i mysql --save
```

## Database

```bash
-- Create Database `marvel`
CREATE DATABASE `marvel`;

-- Create Table `avengers`
CREATE TABLE IF NOT EXISTS `avengers` (
  `id` INT(12) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL DEFAULT '',
  `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` BOOLEAN NOT NULL DEFAULT '0'  
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
```

## Server

```javascript
// server.js
const rest_docs = require('rest-docs');
var rest = new rest_docs();

rest.startServer({
  ip: '127.0.0.1', //<-- YOUR_SERVER_IP
  port: '8080' //<-- YOUR_SERVER_PORT
})

rest.startDBServer('mysql', {
  host: 'localhost', //<-- YOUR_DATABASE_HOST
  port: 3306, //<-- YOUR_DATABASE_PORT
  user: 'root', //<-- YOUR_DATABASE_USER
  password: '', //<-- YOUR_DATABASE_PASSWORD
  database: 'marvel' //<-- YOUR_DATABASE_NAME
});

const api_config = {
  base: '/api',
  routes: [
    {      
      table: 'avengers', //<-- YOUR_TABLE_NAME
      event: 'AVENGER', //<-- YOUR_EVENT_NAME 
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
# API Docs at http://127.0.0.1:8080/api/docs
# App listening at http://127.0.0.1:8080
```

## Result

* GET `/api/docs`

![API](/resources/img/mysql/api.png)

## Test API

* GET `/api/avengers`

![API](/resources/img/mysql/api_get_all.png)

* GET `/api/avengers/:id`

![API](/resources/img/mysql/api_get_id.png)

* POST `/api/avengers`

![API](/resources/img/mysql/api_post.png)

* PUT `/api/avengers/:id`

![API](/resources/img/mysql/api_put.png)

* DELETE `/api/avengers/:id`

![API](/resources/img/mysql/api_delete.png)

## Author

@[victor-valencia](https://github.com/victor-valencia).

## License

Licensed under the [MIT license](/LICENSE).