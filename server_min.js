const config = require('./config.js');
const api = require('./api.js');

const rest_doc = require('./lib/rest.js');
var rest = new rest_doc();

rest.setConfig(config)
rest.startServer()
rest.buildRoutes(api)