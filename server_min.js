'use strict'

/*
  |--------------------------------------------------------------------------
  | EXAMPLE 2:
  |--------------------------------------------------------------------------
  |
  | Basic configuration (Explicit).
  | Loading 'Server' and 'Database' connection from '.env' file and loading 
  | 'API Config' from file.
  |
  */

const api = require('./api.js');

const rest_doc = require('./lib/rest.js');
var rest = new rest_doc();

rest.startServer()
rest.startDBServer()
rest.buildRoutes(api)