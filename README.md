# [REST-Docs](https://github.com/victor-valencia/rest-docs)

RESTful HTTP client library + Docs to test your API REST. Supports for `PostgreSQL`, `MySQL`, `MariaDB`, `MSSQL` and `SQLite3`.

![API](resources/img/api.png)

## Table of contents
- [Install](#install)
- [Install Database Library](#install-database-library)
- [Usage](#usage)
- [Usage with .env file](#usage-with-env-file)
- [Result](#result)
- [Test API](#test-api)
- [Methods](#methods)
- [Migrations](#migrations)
- [Examples](#examples)
- [Author](#author)
- [License](#license)

## Install

```bash
npm i rest-docs --save
```

## Install Database Library

- `MSSQL`

```bash
npm i mssql --save
```

- `MySQL` and `MariaDB`

```bash
npm i mysql --save
```

- `PostgreSQL`

```bash
npm i pg --save
```

- `SQLite3`

```bash
npm i sqlite3 --save
```

## Usage

```javascript
// server.js
const rest_docs = require('rest-docs');
var rest = new rest_docs();

rest.startServer({
  ip: '127.0.0.1', //<-- YOUR_SERVER_IP
  port: '8080', //<-- YOUR_SERVER_PORT
  compression: 'gzip' //<-- YOUR_COMPRESSION_STRATEGY
})

rest.startDBServer('mysql', {
  host: 'localhost', //<-- YOUR_DATABASE_HOST
  port: 3306, //<-- YOUR_DATABASE_PORT
  user: 'root', //<-- YOUR_DATABASE_USER
  password: '', //<-- YOUR_DATABASE_PASSWORD
  database: 'medic', //<-- YOUR_DATABASE_NAME
  timezone: '+00:00' //<-- YOUR_DATABASE_TIMEZONE
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
        table: 'doctors', //<-- YOUR_TABLE_NAME
        event: 'DOCTOR', //<-- YOUR_EVENT_NAME 
        methods: ['GET', 'POST', 'PUT', 'DELETE'], //<-- YOUR_METHODS
        //Used only by methods 'POST' and 'PUT'
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

## Usage with .env file

```bash
npm i dotenv --save
```

```javascript
// .env
NODE_ENV=development

IP=localhost
PORT=8000
COMPRESSION=gzip

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_DATABASE=medic

API_KEY=65856b68541470a4ad95e7fe8b6bbb40
```

```javascript
// server.js
const rest_docs = require('rest-docs');
var rest = new rest_docs();

rest.startServer()
rest.startDBServer();

const api_config = {
  base: '/api',
  table: {
    created_date: 'created',
    modified_date: 'modified',
    active: 'deleted'
  },
  routes: {
    tb: [
      {      
        table: 'doctors', //<-- YOUR_TABLE_NAME
        event: 'DOCTOR', //<-- YOUR_EVENT_NAME 
        methods: ['GET', 'POST', 'PUT', 'DELETE'], //<-- YOUR_METHODS
        //Used only by methods 'POST' and 'PUT'
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
}

rest.buildRoutes(api_config)
```

Run

```bash
node server.js
# PAGES: {
#   api: 'http://localhost:8000/api',
#   docs: 'http://localhost:8000/api/docs',
#   monitor: 'http://localhost:8000/api/monitor'    
# }
# App listening at http://localhost:8000
```

## Result

* GET `/api/docs`

![API](resources/img/api.png)

## Test API

* GET `/api/doctors`

![API](resources/img/api_get_all.png)

* GET `/api/doctors/:id`

![API](resources/img/api_get_id.png)

* POST `/api/doctors`

![API](resources/img/api_post.png)

* PUT `/api/doctors/:id`

![API](resources/img/api_put.png)

* DELETE `/api/doctors/:id`

![API](resources/img/api_delete.png)

## Pages

* Docs `/api/docs`

![DOCS](resources/img/api.png)

* Monitor `/api/monitor`

![MONITOR](resources/img/monitor.png)

## Methods

- `startServer`(`SERVER_CONFIG`)

The `SERVER_CONFIG` represents the connection to the server.

|Constant     |Default    |Description         |
|-------------|-----------|--------------------|
|`ip`         |'localhost'|Server ip           |
|`port`       |8000       |Server port         |
|`compression`|''         |Compression strategy|

Example:

```javascript
// SERVER_CONFIG
{
  ip: {YOUR_SERVER_IP},
  port: {YOUR_SERVER_PORT},
  compression: {YOUR_COMPRESSION_STRATEGY}
}
```

- `startDBServer`(`CLIENT`, `CONNECTION_CONFIG`)

The `CLIENT` parameter is required and determines which client adapter will be used with the library. By default: `myslq`.

|Database  |CLIENT     |Additional command to install the appropriate database library|
|----------|-----------|--------------------------------------------------------------|
|MariaDB   |`myslq`    |$ npm i mysql --save                                          |
|MSSQL     |`msslq`    |$ npm i mssql --save                                          |
|MySQL     |`myslq`    |$ npm i mysql --save                                          |
|PostgreSQL|`pg`       |$ npm i pg --save                                             |
|SQLite3   |`sqlite`   |$ npm i sqlite3 --save                                        |

The `CONNECTION_CONFIG` represents the connection parameters to the database.

|Constant  |Default    |Description       |
|----------|-----------|------------------|
|`host`    |'localhost'|Database host name|
|`user`    |'root'     |Database user name|
|`password`|''         |Database password |
|`database`|'database' |Database name     |
|`timezone`|'+00:00'   |Database timezone |

Example:

```javascript
// CONNECTION_CONFIG
{
  host: {YOUR_DATABASE_HOST},
  user: {YOUR_DATABASE_USER},
  password: {YOUR_DATABASE_PASSWORD},
  database: {YOUR_DATABASE_NAME},
  timezone: {YOUR_DATABASE_TIMEZONE}
}
```

- `buildRoutes`(`API_CONFIG`)

The `API_CONFIG` represents the API configuration.

|Constant |Description                      |
|---------|---------------------------------|
|`base`   |Main path of the API             |
|`pages`  |Pages of the API                 |
|`table`  |Main configuration for all tables|
|`routes` |All API routes                   |

Example:

```javascript
// API_CONFIG
{
  base: '/api',
  pages: PAGE_CONFIG,
  table: TABLE_CONFIG,
  routes: ROUTE_CONFIG     
}
```

The `PAGE_CONFIG` represents the global configuration of the pages.

|Constant  |Default |Description                              |
|----------|--------|-----------------------------------------|
|`docs`    |true    |Indicates if the docs page is visible    |
|`monitor` |true    |Indicates if the monitor page is visible |

Example:

```javascript
// PAGE_CONFIG
{      
  docs: true,  
  monitor: true
}
```

The `TABLE_CONFIG` represents the global configuration of table.

|Constant        |Default    |Description                      |
|----------------|-----------|---------------------------------|
|`created_date`  |'created'  |Name of the creation date column |
|`modified_date` |'modified' |Name of the modified date column |
|`active`        |'deleted'  |Name of the deleted column       |

Example:

```javascript
// TABLE_CONFIG
{
  created_date: 'created',
  modified_date: 'modified',
  active: 'deleted'
}
```

The `ROUTE_CONFIG` represents the route groups.

|Constant  |Default |Description                  |
|----------|--------|-----------------------------|
|`tb`      |[]      |Group for tables or views    |
|`fn`      |[]      |Group for functions          |
|`sp`      |[]      |Group for stored procedures  |

Example:

```javascript
// ROUTE_CONFIG
{      
  tb: [
    TB_CONFIG,
    ...
  ],  
  fn: [
    FN_CONFIG,
    ...
  ],
  sp: [
    SP_CONFIG,
    ...
  ]
}
```

The `TB_CONFIG` represents the table or view configuration.

|Constant  |Default                          |Description                   |
|----------|---------------------------------|------------------------------|
|`table`   |'table'                          |Table name                    |
|`view`    |null                             |View name                     |
|`event`   |'TABLE'                          |Event name<br />(For socket.io event. => 'TABLE_INSERTED', 'TABLE_UPDATED', 'TABLE_DELETED') |
|`methods` |['GET', 'POST', 'PUT', 'DELETE'] |List of methods to implement<br />['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'SEARCH', 'SEARCH_COLUMN', 'POST_BATCH', 'PUT_BATCH', 'PATCH_BATCH', 'DELETE_BATCH']  |
|`columns` |[]                               |List of columns<br />(Used only by methods 'POST', 'PUT', 'PATCH', 'POST_BATCH', 'PUT_BATCH' and 'PATCH_BATCH') |

Example:

```javascript
// TB_CONFIG
{      
  table: 'table',  
  view: null,
  event: 'TABLE',  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  
  columns: [
    COLUMN_CONFIG,
    ...
  ]
}
```

The `COLUMN_CONFIG` represents the column of table.

|Constant  |Default    |Description                                             |
|----------|-----------|--------------------------------------------------------|
|`name`    |''         |Column name                                             |
|`primary` |false      |Defines if column is primary key                        |
|`hidden`  |false      |Defines if the column data will be sent in the response |

Example:

```javascript
// COLUMN_CONFIG
{
  name: 'id', 
  primary: true,
  hidden: true
}
```

The `FN_CONFIG` represents the function configuration.

|Constant   |Default    |Description    |
|-----------|-----------|---------------|
|`function` |'function' |Function name  |
|`params`   |[]         |List of params |

Example:

```javascript
// FN_CONFIG
{      
  function: 'function',  
  params: [
    PARAM_CONFIG,
    ...
  ]
}
```

The `SP_CONFIG` represents the stored procedure configuration.

|Constant    |Default     |Description           |
|------------|------------|----------------------|
|`procedure` |'procedure' |Stored procedure name |
|`params`    |[]          |List of params        |

Example:

```javascript
// SP_CONFIG
{      
  procedure: 'procedure',  
  params: [
    PARAM_CONFIG,
    ...
  ]
}
```

The `PARAM_CONFIG` represents the param of function or stored procedure.

|Constant  |Default |Description |
|----------|--------|------------|
|`name`    |''      |Param name  |

Example:

```javascript
// PARAM_CONFIG
{
  name: 'n'
}
```

## Examples

- [MySQL or MariaDB](/examples/MySQL.md).
- [PostgreSQL](/examples/PostgreSQL.md).
- [SQLite3](/examples/SQLite3.md).

## Migrations

- [For version 0.x to 1.x](/examples/Migration_v.0.x_to_v1.x.md).

## Author

@[victor-valencia](https://github.com/victor-valencia).

## License

Licensed under the [MIT license](LICENSE).