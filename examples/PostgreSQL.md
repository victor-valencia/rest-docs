# [REST-Docs](https://github.com/victor-valencia/rest-docs)

Example with `PostgreSQL`.

![API](/resources/img/PostgreSQL/api.png)

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

- Install `PostgreSQL` database library.

```bash
npm i pg --save
```

## Database

```bash
-- Create Database `cinema`
CREATE DATABASE cinema;

-- Create Table `movies`
CREATE TABLE IF NOT EXISTS movies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL DEFAULT '',
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted BOOLEAN NOT NULL DEFAULT '0'  
);
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

rest.startDBServer('pg', {
  host: 'localhost', //<-- YOUR_DATABASE_HOST
  port: 5432, //<-- YOUR_DATABASE_PORT
  user: 'postgres', //<-- YOUR_DATABASE_USER  
  password: '', //<-- YOUR_DATABASE_PASSWORD
  database: 'cinema' //<-- YOUR_DATABASE_NAME
});

const api_config = {
  base: '/api',
  routes: [
    {      
      table: 'movies', //<-- YOUR_TABLE_NAME
      event: 'MOVIE', //<-- YOUR_EVENT_NAME 
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

![API](/resources/img/PostgreSQL/api.png)

## Test API

* GET `/api/movies`

![API](/resources/img/PostgreSQL/api_get_all.png)

* GET `/api/movies/:id`

![API](/resources/img/PostgreSQL/api_get_id.png)

* POST `/api/movies`

![API](/resources/img/PostgreSQL/api_post.png)

* PUT `/api/movies/:id`

![API](/resources/img/PostgreSQL/api_put.png)

* DELETE `/api/movies/:id`

![API](/resources/img/PostgreSQL/api_delete.png)

## Author

@[victor-valencia](https://github.com/victor-valencia).

## License

Licensed under the [MIT license](/LICENSE).