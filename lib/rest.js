const extend = require('extend');
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')

const Package = require("../package.json");
const Config_Server = require("./config/server.js");
const Config_DB = require("./config/database.js");
const Config_API = require("./config/api.js");
const Color = require("./color.js");


function Rest_doc_api(){

  var self = this;
  self._routes = {};
  self.config_server = Config_Server;
  self.config_db = Config_DB;
  
}

Rest_doc_api.prototype.startServer = function(config){

  var self = this;

  self.config_server = extend({}, self.config_server, config);

  console.log('SERVER:', self.config_server)

  self.app = express();

  self.app.use(cors());  
  self.app.use(bodyParser.urlencoded({ extended: false }))  
  self.app.use(bodyParser.json())

  const server = self.app.listen(self.config_server.port, self.config_server.ip, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
  });   

  const io = require('socket.io').listen(server);
  self.sockets_ = io.sockets;
  
  return self.app

}

Rest_doc_api.prototype.startDBServer = function(client, config){

  var self = this;

  self.client_db = client || self.config_db.connection;
  self.config_database = extend({}, self.config_db[self.client_db]['connection'], config);
  console.log('CLIENT:', self.client_db, 'DATABASE:', self.config_database)

  self.knex = require('knex')({
    client: self.client_db,
    connection: self.config_database,
    // pool: {
    //   afterCreate: function (conn, done) {
    //     // in this example we use pg driver's connection API
    //     conn.query('SET timezone="UTC";', function (err) {
    //       if (err) {
    //         // first query failed, return error and don't try to make next query
    //         done(err, conn);
    //       } else {
    //         // do the second query...
    //         conn.query('SELECT set_limit(0.01);', function (err) {
    //           // if err is not falsy, connection is discarded from pool
    //           // if connection aquire was triggered by a query the error is passed to query promise
    //           done(err, conn);
    //         });
    //       }
    //     });
    //   }
    // }
  }).on('query', (query) => {
    console.log("QRY =>", query.sql, ", params =>", query.bindings)
  }) 

  return self.knex

}

Rest_doc_api.prototype.buildRoutes = function(api){    

    var self = this;
    self.base = api.base || Config_API.BASE_CONFIG;

    self.table = Config_API.TABLE_CONFIG;
    if(typeof api.table !== 'undefined')
      self.table = extend({},  Config_API.TABLE_CONFIG, api.table);

    api.routes.forEach(function(v){

      self.build(v);

    })

    self.printRoutes();    

}

Rest_doc_api.prototype.printRoutes = function(){

  var self = this;

  // console.log(self._routes)

  // var routes = [];
  // self.app._router.stack.forEach(function(v){

  //   if(typeof v.route != 'undefined'){
  //     var method = Object.keys(v.route.methods);
  //     console.log(method[0].toUpperCase(), v.route.path)
  //     routes.push({method: method[0].toUpperCase(), url: v.route.path, color: Color[method[0]]});
  //   }

  // })

  // self.app.get(self.base,function(req, res){

  //   res.status(200).jsonp(routes);

  // });

  // Docs
  self.app.set('view engine', 'ejs');
  self.app.set('views', path.join(__dirname, '/docs/views'));

  self.app.get(self.base + '/docs', function(req, res) {
    res.render('index', {o: self._routes, client: self.client_db, version: Package.version});
    // res.status(200).jsonp({});
  });

  console.log('API Docs at http://%s:%s%s/docs', self.config_server.ip, self.config_server.port, self.base);

}

Rest_doc_api.prototype.getColumnsObject = function(columns, values) {

    var self = this;

    var obj = {};
    if(typeof values.batch === 'undefined'){
        columns.forEach(function(v){
            try{
               obj[v.name] = values[v.name];
            }
            catch(ex){
               obj[v.name] = null;
            }
        });
    } else {
        data = JSON.parse(values.batch);

        var all = []
        data.forEach(function(v){
            var obj = []
            columns.forEach(function(c){
               try{
                   obj.push(v[c.name]);
               }
               catch(ex){
                   obj.push(null);
               }
            });
            obj.push(new Date().getNow());
            all.push(obj);
        });

        obj = all;
        //obj = [[1,2,3],[1,2,4]];
    }

    //console.log(obj);
    return obj;

}

Rest_doc_api.prototype.getColumnsName = function(columns) {

    var self = this;

    var names = [];
    columns.forEach(function(v){
        names.push(v.name);
    });
    names.push(self.table.created_date);
    return names;

}

Rest_doc_api.prototype.extend = function(config) {

    var cfg = extend({}, Config_API.ROUTE_CONFIG, config);

    cfg.columns.forEach(function(v, i){
        cfg.columns[i] = extend({}, Config_API.COLUMN_CONFIG, v);
    });

    //console.log(cfg);

    return cfg;

}

Rest_doc_api.prototype.processFilter = function(knex, filter) {

  var self = this;
  
  if(typeof filter !== 'undefined'){

    console.log('processFilter', filter)

    if(typeof filter.filters !== 'undefined')
      self.buildKnexFilter(knex, filter);
    // console.log(filter);
  }
  else {

    //self.buildKnexFilter(knex, {field: 1, op: '=', value: 1}, 'and');

  }

}

Rest_doc_api.prototype.getSort = function(sort) {

  var a = [];
  if(typeof sort !== 'undefined'){
    sort.forEach(function(s){
        a.push({ column: s.field, order: s.dir });
    });  
  }
  // console.log("SORT PROCESS", a)
  return a;

}

Rest_doc_api.prototype.buildKnexFilter = function(knex, filter, logic) {

  var self = this;

  if(Array.isArray(filter.filters)){

      filter.filters.forEach(function(v){
          self.buildKnexFilter(knex, v, filter.logic)
      });

  }
  else {

    var f = self.getFilter(filter)    
    if(logic == 'and') {
      //AND
      switch(f.op){
        case "IS NULL":     knex.whereNull(f.field);                break;
        case "IS NOT NULL": knex.whereNotNull(f.field);             break;
        case "BETWEEN":     knex.whereBetween(f.field, f.value);    break;
        default:            knex.andWhere(f.field, f.op, f.value);  break;
      }      
    }
    else {
      //OR
      switch(f.op){
        case "IS NULL":     knex.orWhereNull(f.field);              break;
        case "IS NOT NULL": knex.orWhereNotNull(f.field);           break;
        case "BETWEEN":     knex.orWhereBetween(f.field, f.value);  break;
        default:            knex.orWhere(f.field, f.op, f.value);   break;
      }
    }

  }

  return 0;
}

Rest_doc_api.prototype.getFilter = function(filter){
  
  var v = filter;
  switch(v.operator){
    case 'startswith':      return {field: v.field, op: "LIKE", value: v.value + "%"};            break; //ok
    case 'contains':        return {field: v.field, op: "LIKE", value: "%" + v.value + "%"};      break; //ok
    case 'doesnotcontain':  return {field: v.field, op: "NOT LIKE", value: "%" + v.value + "%"};  break; //ok
    case 'endswith':        return {field: v.field, op: "LIKE", value: "%" + v.value};            break; //ok
    case 'eq':              return {field: v.field, op: "=", value: v.value};                     break; //ok
    case 'neq':             return {field: v.field, op: "!=", value: v.value};                    break; //ok      
    case 'gte':             return {field: v.field, op: ">=", value: v.value};                    break; 
    case 'gt':              return {field: v.field, op: ">", value: v.value};                     break; 
    case 'lte':             return {field: v.field, op: "<=", value: v.value};                    break; 
    case 'lt':              return {field: v.field, op: "<", value: v.value};                     break; 
    case 'isnull':          return {field: v.field, op: "IS NULL", value: null};                  break; //ok 
    case 'isnotnull':       return {field: v.field, op: "IS NOT NULL", value: null};              break; //ok 
    case 'isempty':         return {field: v.field, op: "=", value: ""};                          break; //ok 
    case 'isnotempty':      return {field: v.field, op: "!=", value: ""};                         break; //ok
    case 'in': {
      var values = [];
      v.value.split(",").forEach(function(v){
          values.push("'" + v.trim() + "'");
      });
      return {field: v.field, op: "IN", value: values};
    }; break;
    case 'inrange': {
      var values = v.value.split(",");
      if(values.length == 2){
        return {field: v.field, op: "BETWEEN", value: [values[0].trim(), values[1].trim()]};
      }
      else {
        return {field: 1, op: "=", value: 1};
      }
    }; break;
  }

}

Rest_doc_api.prototype.build = function(config) {

    var self = this;    

    config = self.extend(config);

    var primary = [];
    var columns = [];
    config.columns.forEach(function(v){
        (v.primary === true) ? primary.push(v) : columns.push(v);
    });    


    self._group = [];

    if (config.methods.indexOf('GET') >= 0) {

      // console.log("GET - " + config.table);        
      self.methodGetAll(config, primary, columns);

      self.methodGetById(config, primary, columns);
      
    }

    if (config.methods.indexOf('SEARCH') >= 0) {

      // console.log("SEARCH - " + config.table);  
      self.methodSearch(config, primary, columns);      
    
    }

    if (config.methods.indexOf('SEARCH_COLUMN') >= 0) {

      // console.log("SEARCH_COLUMN - " + config.table);  
      self.methodSearchColumn(config, primary, columns);      
    
    }

    if (config.methods.indexOf('POST') >= 0) {

      // console.log("POST - " + config.table);        
      self.methodPost(config, primary, columns);

    }

    if (config.methods.indexOf('PUT') >= 0) {

      // console.log("PUT - " + config.table);
      self.methodPut(config, primary, columns);

    }

    if (config.methods.indexOf('DELETE') >= 0) {

      // console.log("DELETE - " + config.table);
      self.methodDelete(config, primary, columns);

    }

    self._routes[config.table] = self._group;

}

Rest_doc_api.prototype.methodGetAll = function(config, primary, columns) {

  var self = this;
  var url = self.base + '/' + config.table;

  self._group.push({
    method: 'GET', 
    url: url, 
    params: [], 
    color: Color.GET
  });

  self.app.get(url, function(req, res){      

    var params = {};
    params[self.table.active] = 0

    var table = (config.view === null) ? config.table : config.view;
    self.knex(table).select('*').where(params)      
      .then(function(rows) {
        // console.log(rows)
        res.status(200).jsonp(rows)
      })        
      .catch(function(err){
        res.status(500).json({error : "Error executing Query ", detail: err});
      });

  });

}

Rest_doc_api.prototype.methodGetById = function(config, primary, columns) {

  var self = this;
  var url = self.base + '/' + config.table + "/:id";

  self._group.push({
    method: 'GET', 
    url: url, 
    params: primary, 
    color: Color.GET
  });

  self.app.get(url, function(req, res){    

    var params = {id: req.params.id};
    params[self.table.active] = 0

    var table = (config.view === null) ? config.table : config.view;
    self.knex(table).select('*').where(params)
      .then(function(rows) {
        // console.log(rows)
        if(rows.length === 0) {
          res.status(404).json({error: "Data not found"});
        } else {
          res.status(200).jsonp(rows[0]);            
        }          
      })        
      .catch(function(err){
        res.status(500).json({error : "Error executing Query ", detail: err});
      });

  });

}

Rest_doc_api.prototype.methodSearch = function(config, primary, columns) {

  var self = this;
  var url = self.base + '/' + config.table + "/search";

  self._group.push({
    method: 'POST', 
    url: url, 
    params: [{name: 'skip'}, {name: 'take'}],    
    color: Color.POST
  });

  self.app.post(url, function(req, res){

    var params = {};
    params[self.table.active] = 0

    console.log("FILTER", req.body.filter);    

    var table = (config.view === null) ? config.table : config.view;
    self.knex(table).select('*').where(params).andWhere(function(){
        self.processFilter(this, req.body.filter)        
      })
      .then(function(rows) {
        // console.log(rows)
        var total = rows.length;
        var sort = self.getSort(req.body.sort);
        var take = (typeof req.body.take === 'undefined') ? 0 : req.body.take;
        var skip = (typeof req.body.skip === 'undefined') ? 0 : req.body.skip;
        if(take != 0){
            //var offset = (page - 1) * take;
            // query += " LIMIT " + skip + ", " + take;
            self.knex(table).select('*').where(params).andWhere(function(){
              self.processFilter(this, req.body.filter)
            }).orderBy(sort).limit(take).offset(skip)
            .then(function(rows) {
              // console.log(rows)
              res.status(200).jsonp({total: total, data: rows, state: req.body})
            })        
            .catch(function(err){
              res.status(500).json({error : "Error executing Query ", detail: err});
            })

        }
        else {

          self.knex(table).select('*').where(params).andWhere(function(){
            self.processFilter(this, req.body.filter)
          }).orderBy(sort)
          .then(function(rows) {
            // console.log(rows)
            res.status(200).jsonp({total: total, data: rows, state: req.body})
          })        
          .catch(function(err){
            res.status(500).json({error : "Error executing Query ", detail: err});
          })

        }         
      })        
      .catch(function(err){
        console.log(err);
        res.status(500).json({error : "Error executing Query ", detail: err});
      })

  });

}


Rest_doc_api.prototype.methodSearchColumn = function(config, primary, columns) {

  var self = this;
  var url = self.base + '/' + config.table + "/search_column";

  self._group.push({
    method: 'POST', 
    url: url, 
    params: [{name: 'field'}, {name: 'operator'}, {name: 'value'}],    
    color: Color.POST
  });

  self.app.post(url, function(req, res){

    if(typeof req.body.field === 'undefined' || typeof req.body.operator === 'undefined') {
      res.status(500).json({error : "Error required params", detail: 'Required params [field, operator]'});
    }
    else if(req.body.field === '' || req.body.operator === '') {
      res.status(500).json({error : "Error required params values", detail: 'Required params values [field, operator]'});
    }  
    else {
      
      req.body.value = req.body.value || '';

      var params = {};
      params[self.table.active] = 0

      var table = (config.view === null) ? config.table : config.view;
      self.knex(table).select('*').where(params).andWhere(function(){
          //self.processFilter(this, req.body.filter)        
          self.buildKnexFilter(this, req.body, 'and')
        })
        .then(function(rows) {
          // console.log(rows)
          res.status(200).jsonp(rows)
        })        
        .catch(function(err){
          console.log(err)
          res.status(500).json({error : "Error executing Query ", detail: err});
        })

    }
         
  });

}

Rest_doc_api.prototype.methodPost = function(config, primary, columns) { 

  var self = this;
  var url = self.base + '/' + config.table;

  self._group.push({
    method: 'POST', 
    url: url, 
    params: columns, 
    color: Color.POST
  });

  self.app.post(url, function(req, res){
        
    var params = self.getColumnsObject(columns, req.body);
    params[self.table.created_date] = self.knex.fn.now();
    params[self.table.modified_date] = self.knex.fn.now();

    self.knex(config.table).returning('id').insert(params)
      .then(function(resp) {
                
        if(resp.length === 0) {
            res.status(404).json({error: "The data is not inserted"});
        }
        else {

          var id = resp[0]
          console.log("Inserted [id: %d]", id);
            
          //RETURN AFFECTED ROW
          //------------------------------------------------------------------------
          self.knex(config.table).select('*').where('id', '=', id)
            .then(function(rows) {
              // var data = (err || rows.length === 0) ? null: rows;
              // console.log(rows);
              res.status(200).jsonp({data: rows});
              self.sockets_.emit(config.event + '_INSERTED', rows);
            })        
            .catch(function(err){
              res.status(500).json({error : "Error executing Query ", detail: err});
            });
          //------------------------------------------------------------------------

        }
      })        
      .catch(function(err){
        res.status(500).json({error : "Error executing Query ", detail: err});
      });

  });
  
}

Rest_doc_api.prototype.methodPut = function(config, primary, columns) { 

  var self = this;
  var url = self.base + '/' + config.table + "/:id";

  self._group.push({
    method: 'PUT', 
    url: url, 
    params: columns, 
    color: Color.PUT
  });

  self.app.put(url, function(req, res){ 

    var params = self.getColumnsObject(columns, req.body);
    params[self.table.modified_date] = self.knex.fn.now();
    //console.log(params)

    self.knex(config.table).where('id', '=', req.params.id).update(params)    
      .then(function(resp) {
        //console.log(resp)
        if(resp.length === 0) {
            res.status(404).json({error: "The data is not inserted"});
        }
        else {

          console.log("Updates [id: %d]", req.params.id);
          //RETURN AFFECTED ROW
          //------------------------------------------------------------------------
          self.knex(config.table).select('*').where('id', '=', req.params.id)
            .then(function(rows) {
              // var data = (err || rows.length === 0) ? null: rows;
              // console.log(rows);
              res.status(200).jsonp({data: rows});
              self.sockets_.emit(config.event + '_UPDATED', rows);
            })        
            .catch(function(err){
              res.status(500).json({error : "Error executing Query ", detail: err});
            });
          //------------------------------------------------------------------------

        }
      })        
      .catch(function(err){
        console.log(err)
        res.status(500).json({error : "Error executing Query ", detail: err});
      });

  });
  
}

Rest_doc_api.prototype.methodDelete = function(config, primary, columns) {

  var self = this;
  var url = self.base + '/' + config.table + "/:id";

  self._group.push({
    method: 'DELETE', 
    url: url, 
    params: primary, 
    color: Color.DELETE
  });
        
  self.app.delete(url, function(req, res){

    var params = {};
    params[self.table.modified_date] = self.knex.fn.now();
    params[self.table.active] = 1

    self.knex(config.table).where('id', '=', req.params.id).update(params)
      .then(function(rows) {
        if(rows === 0) {
            res.status(404).json({error: "The data is not deactive"});
        }
        else {
          
          console.log("Deleted [id: %d]", req.params.id);
          //RETURN AFFECTED ROW
          //------------------------------------------------------------------------
          self.knex(config.table).select('*').where('id', '=', req.params.id)
            .then(function(rows) {
              // var data = (err || rows.length === 0) ? null: rows;
              // console.log(rows);
              res.status(200).jsonp({data: rows});
              self.sockets_.emit(config.event + '_DELETED', rows);
            })        
            .catch(function(err){
              res.status(500).json({error : "Error executing Query ", detail: err});
            });
          //------------------------------------------------------------------------

        }
      })        
      .catch(function(err){
        res.status(500).json({error : "Error executing Query ", detail: err});
      });

  });

}

// Rest_doc_api.prototype.emitEvent = function(event, table, id, req, res) {

//     var self = this;

//     self.knex(table).select('*').where('id', '=', id)
//       .then(function(rows) {
//         // var data = (err || rows.length === 0) ? null: rows;
//         console.log(rows);
//         res.status(200).jsonp({data: rows});
//         self.sockets_.emit(event, data);
//       })        
//       .catch(function(err){
//         res.status(500).json({error : "Error executing Query ", detail: err});
//       });


//     // var query = "SELECT * FROM " + table + " WHERE id = ?";
//     // var params = [ id ];
//     // var qry = self.con_.query(query, params, function(err, rows, fields){
//     //     //console.log(rows);
//     //     var data = (err || rows.length === 0) ? null: rows;
//     //     console.log(data);
//     //     res.status(200).jsonp({data: data});
//     //     self.sockets_.emit(event, data);

//     // });
//     // console.log(qry.sql);

// }

module.exports = Rest_doc_api;
