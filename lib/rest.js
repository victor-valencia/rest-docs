const extend = require('extend');
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')

const Package = require("../package.json");
const Database = require("./database.js");
const date = require("./date.js");
const Color = require("./color.js");


function Rest_doc_api(){

  var self = this;
  // self.app = null;
  // self.con_ = null;
  // self.sockets_ = null;    

  self.created_date = 'created';
  self.modified_date = 'modified';
  self.active = 'deleted';

  self._routes = {};
  
}

Rest_doc_api.prototype.setConfig = function(config){    

  var self = this;
  self.config = config;   

}

Rest_doc_api.prototype.startServer = async function(){

  var self = this;
  self.app = express();

  self.app.use(cors());  
  self.app.use(bodyParser.urlencoded({ extended: false }))  
  self.app.use(bodyParser.json())
  
  if( typeof self.config != 'undefined') {

    const server = self.app.listen(self.config.SERVER.PORT, self.config.SERVER.IP, function () {
      var host = server.address().address;
      var port = server.address().port;
      console.log('App listening at http://%s:%s', host, port);
    });   

    const io = require('socket.io').listen(server);
    self.sockets_ = io.sockets;
    
    const pool = await Database.getConnection(self.config.DATABASE);
    console.log(pool.msg);
    self.con_ = pool.con;

  }

  return self.app

}

Rest_doc_api.prototype.buildRoutes = function(api){    

    var self = this;
    self.base = api.base;

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
    res.render('pages/index', {o: self._routes, version: Package.version});
    // res.status(200).jsonp({});
  });

  console.log('API Docs at http://%s:%s%s/docs', self.config.SERVER.IP, self.config.SERVER.PORT, self.base);

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
    names.push(self.created_date);
    return names;

}

Rest_doc_api.prototype.extend = function(config) {

    var cfg = extend({}, {
        table: 'table',
        view: null,
        event: 'TABLE',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'SEARCH', 'PUT_BATCH'],
        columns: []
    }, config);

    cfg.columns.forEach(function(v, i){
        cfg.columns[i] = extend({name: 'column', primary: false}, v);
    });

    //console.log(cfg);

    return cfg;

}

Rest_doc_api.prototype.buildFilter = function(filter) {

    var self = this;

    var qry = "";
    if(Array.isArray(filter.filters)){

        var f = [];
        filter.filters.forEach(function(v){
            f.push(self.buildFilter(v));
        });

        qry += "( " + f.join(" " + filter.logic + " ") + " )";        

    }
    // else if(filter.filters instanceof Object){

    //     console.log('IS OBJECT');

    //     var f = [];
    //     Object.entries(filter.filters).forEach(function(k, v){
    //       // console.log(k[1]);
    //       f.push(self.buildFilter(k[1]));
    //     });

    //     qry += "( " + f.join(" " + filter.logic + " ") + " )";

    // }
    else {

        var v = filter;
        switch(v.operator){
            case 'startswith': qry =  v.field + " LIKE '" + v.value + "%'"; break;
            case 'contains': qry =  v.field + " LIKE '%" + v.value + "%'"; break;
            case 'doesnotcontain': qry =  v.field + " NOT LIKE '%" + v.value + "%'"; break;
            case 'endswith': qry =  v.field + " LIKE '%" + v.value + "'"; break;
            case 'eq': qry =  v.field + " = '" + v.value + "'"; break;
            case 'neq': qry =  v.field + " != '" + v.value + "'"; break;
            case 'gte': qry =  v.field + " >= '" + v.value + "'"; break;
            case 'gt': qry =  v.field + " > '" + v.value + "'"; break;
            case 'lte': qry =  v.field + " <= '" + v.value + "'"; break;
            case 'lt': qry =  v.field + " < '" + v.value + "'"; break;
            case 'isnull': qry =  v.field + " IS NULL"; break;
            case 'isnotnull': qry =  v.field + " IS NOT NULL"; break;
            case 'isempty': qry =  v.field + " = ''"; break;
            case 'isnotempty': qry =  v.field + " != ''"; break;
            case 'in': {
                var values = [];
                v.value.split(",").forEach(function(v){
                    values.push("'" + v.trim() + "'");
                });
                qry =  v.field + " IN (" + values.join(",") + ")"
            }; break;
            case 'inrange': {
                var values = v.value.split(",");
                if(values.length == 2){
                    qry =  v.field + " BETWEEN '" + values[0].trim() + "' AND '" + values[1].trim() + "'";
                }
                else {
                    qry = " 1";
                }

            }; break;
        }

    }

    return qry;
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

        self._group.push({method: 'GET', url: self.base + '/' + config.table, params: [], color: Color.GET});

        self.app.get(self.base + '/' + config.table, function(req, res){

            var table = (config.view === null) ? config.table : config.view;

            var columns = "*";
            if(typeof req.query.fn !== 'undefined' && typeof req.query.fn_param !== 'undefined' && typeof req.query.fn_name !== 'undefined'){
                columns = req.query.fn + "(" + req.query.fn_param + ") as " + req.query.fn_name;
            }

            var query = "SELECT " + columns + " FROM " + table + " WHERE " + self.active + " = 0 ";

            if(typeof req.query.filter !== 'undefined'){
                query += "AND " + self.buildFilter(req.query.filter);

                console.log(req.query.filter);
            }

            if(typeof req.query.fn !== 'undefined' && typeof req.query.fn_param !== 'undefined' && typeof req.query.fn_name !== 'undefined'){
                if(req.query.fn == 'distinct'){
                    query += " GROUP BY (" + req.query.fn_param + ") ASC";
                }
            }

            console.log(query);

            var find = [1];

            qry = self.con_.query(query, find, function(err, rows){
                if(err) {
                    res.status(500).json({error: "Error executing MySQL query: " + query, detail: err});
                } else {

                    var total = rows.length;

                    if(typeof req.query.sort !== 'undefined'){

                        var sort = [];
                        req.query.sort.forEach(function(s){
                            sort.push(s.field + " " + s.dir);
                        });
                        query += " ORDER BY " + sort.join(", ");

                    }

                    //var page = (typeof req.query.page === 'undefined') ? 1 : req.query.page;
                    var take = (typeof req.query.take === 'undefined') ? 0 : req.query.take;
                    var skip = (typeof req.query.skip === 'undefined') ? 0 : req.query.skip;
                    if(take != 0){
                        //var offset = (page - 1) * take;
                        query += " LIMIT " + skip + ", " + take;
                    }
                    qry = self.con_.query(query, find, function(err, rows){
                        if(err) {
                            res.status(500).json({error: "Error executing MySQL query", detail: err});
                        } else {
                            if(typeof req.query.fn !== 'undefined' && typeof req.query.fn_param !== 'undefined' && typeof req.query.fn_name !== 'undefined'){
                                res.status(200).jsonp(rows);
                            }
                            else{
                                res.status(200).jsonp({total: total, data: rows});
                            }
                        }
                    });

                    console.log(qry.sql);
                    //res.status(200).jsonp(rows);
                }
            });
            //console.log(qry.sql);

        });

        self._group.push({method: 'GET', url: self.base + '/' + config.table + "/:id", params: primary, color: Color.GET});

        self.app.get(self.base + '/' + config.table + "/:id",function(req, res){

            var table = (config.view === null) ? config.table : config.view;
            var query = "SELECT * FROM " + table + " WHERE id = " + req.params.id + " AND " + self.active + " = 0";
            qry = self.con_.query(query, [], function(err, rows){
                if(err) {
                    res.status(500).json({error: "Error executing MySQL query", detail: err});
                } else {
                    if(rows.length === 0) {
                        res.status(404).json({error: "Data not found"});
                    } else {
                        res.status(200).jsonp(rows[0]);
                    }
                }
            });
            console.log(qry.sql);

        });
      
    }

    if (config.methods.indexOf('SEARCH') >= 0) {

      // console.log("SEARCH - " + config.table);  
      
      self._group.push({method: 'POST', url: self.base + '/' + config.table + "/search", params: [{name: 'skip'}, {name: 'take'}], color: Color.GET});

      self.app.post(self.base + '/' + config.table + "/search", function(req, res){

        // res.status(200).jsonp(req.body);
        // return 0;
          var table = (config.view === null) ? config.table : config.view;
          
          var columns = "*";
          if(typeof req.body.fn !== 'undefined' && typeof req.body.fn_param !== 'undefined' && typeof req.body.fn_name !== 'undefined'){
              columns = req.body.fn + "(" + req.body.fn_param + ") as " + req.body.fn_name;
          }

          var query = "SELECT " + columns + " FROM " + table + " WHERE " + self.active + " = 0 ";

          if(typeof req.body.filter !== 'undefined' && req.body.filter.filters.length){
              query += "AND " + self.buildFilter(req.body.filter);

              console.log(req.body.filter);
          }

          if(typeof req.body.fn !== 'undefined' && typeof req.body.fn_param !== 'undefined' && typeof req.body.fn_name !== 'undefined'){
              if(req.body.fn == 'distinct'){
                  query += " GROUP BY (" + req.body.fn_param + ") ASC";
              }
          }

          console.log(query);

          var find = [1];

          qry = self.con_.query(query, find, function(err, rows){
              if(err) {
                  res.status(500).json({error: "Error executing MySQL query: " + query, detail: err});
              } else {

                  var total = rows.length;

                  if(typeof req.body.sort !== 'undefined' && req.body.sort.length){

                      var sort = [];
                      req.body.sort.forEach(function(s){
                          sort.push(s.field + " " + s.dir);
                      });
                      query += " ORDER BY " + sort.join(", ");

                  }

                  //var page = (typeof req.body.page === 'undefined') ? 1 : req.body.page;
                  var take = (typeof req.body.take === 'undefined') ? 0 : req.body.take;
                  var skip = (typeof req.body.skip === 'undefined') ? 0 : req.body.skip;
                  if(take != 0){
                      //var offset = (page - 1) * take;
                      query += " LIMIT " + skip + ", " + take;
                  }
                  qry = self.con_.query(query, find, function(err, rows){
                      if(err) {
                          res.status(500).json({error: "Error executing MySQL query", detail: err});
                      } else {
                          if(typeof req.body.fn !== 'undefined' && typeof req.body.fn_param !== 'undefined' && typeof req.body.fn_name !== 'undefined'){
                              res.status(200).jsonp(rows);
                          }
                          else{
                              res.status(200).jsonp({total: total, data: rows, state: req.body});
                          }
                      }
                  });

                  console.log(qry.sql);
                  //res.status(200).jsonp(rows);
              }
          });
          //console.log(qry.sql);

      });
    
    }

    if (config.methods.indexOf('POST') >= 0) {

        // console.log("POST - " + config.table);

        self._group.push({method: 'POST', url: self.base + '/' + config.table, params: columns, color: Color.POST});

        self.app.post(self.base + '/' + config.table,function(req, res){
          
            var values = self.getColumnsObject(columns, req.body)
            if(Array.isArray(values)){
                var query = "INSERT INTO " + config.table + " (??) VALUES ?";
                //values[self.created_date] = new Date().getNow();
                var names = self.getColumnsName(columns);
                qry = self.con_.query(query, [names, values], function(err, result){
                    if(err) {
                        res.status(500).json({error: "Error executing MySQL query", detail: err});
                    } else {

                        res.status(200).json(result);
                        //var table = (config.view === null) ? config.table : config.view;
                        //self.emitEvent(config.event + '_INSERTED', table, result.insertId, req, res);

                        // if (config.table === 'balances') {
                        //     // Iniciar Balance por id de balance
                        //     new balance(self.con_, req.params.id, 'id');
                        // }
                        // else if (config.table === 'riegos') {
                        //     // Iniciar Balance por id de parcela
                        //     new balance(self.con_, values.id_parcela, 'id_parcela');
                        // }
                    }
                });
            }
            else {
                var query = "INSERT INTO " + config.table + " SET ?";
                values[self.created_date] = new Date().getNow();
                qry = self.con_.query(query, values, function(err, result){
                    if(err) {
                        res.status(500).json({error: "Error executing MySQL query", detail: err});
                    } else {
                        var table = (config.view === null) ? config.table : config.view;
                        self.emitEvent(config.event + '_INSERTED', table, result.insertId, req, res);

                        // if (config.table === 'balances') {
                        //     // Iniciar Balance por id de balance
                        //     new balance(self.con_, req.params.id, 'id');
                        // }
                        // else if (config.table === 'riegos') {
                        //     // Iniciar Balance por id de parcela
                        //     new balance(self.con_, values.id_parcela, 'id_parcela');
                        // }

                    }
                });
            }
            console.log(qry.sql);

        });

    }

    if (config.methods.indexOf('PUT') >= 0) {

        // console.log("PUT - " + config.table);

        self._group.push({method: 'PUT', url: self.base + '/' + config.table + "/:id", params: columns, color: Color.PUT});

        self.app.put(self.base + '/' + config.table + "/:id",function(req, res){

            var query = "UPDATE " + config.table + " SET ? WHERE id = ?";
            var values = [self.getColumnsObject(columns, req.body), req.params.id];
            qry = self.con_.query(query, values, function(err, result){
                if(err) {
                    res.status(500).json({error: "Error executing MySQL query", detail: err});
                } else {
                    if(result.affectedRows === 0){
                        res.status(404).json({error: "The data is not updated"});
                    }
                    else{
                        var table = (config.view === null) ? config.table : config.view;
                        self.emitEvent(config.event + '_UPDATED', table, req.params.id, req, res);


                        // if (config.table === 'balances') {
                        //     // Iniciar Balance por id de balance
                        //     new balance(self.con_, req.params.id, 'id');
                        // }
                        // else if (config.table === 'riegos') {
                        //     // Iniciar Balance por id de parcela
                        //     new balance(self.con_, values[0].id_parcela, 'id_parcela');
                        // }

                    }
                }
            });
            console.log(qry.sql);

        });

    }

    if (config.methods.indexOf('DELETE') >= 0) {

        // console.log("DELETE - " + config.table);

        self._group.push({method: 'DELETE', url: self.base + '/' + config.table + "/:id", params: primary, color: Color.DELETE});
        
        self.app.delete(self.base + '/' + config.table + "/:id",function(req, res){

            var query = "UPDATE " + config.table + " SET " + self.active + " = 1 WHERE id = ?";
            var values = [req.params.id];
            qry = self.con_.query(query, values, function(err, result){
                if(err) {
                    res.status(500).json({error : "Error executing MySQL query", detail: err});
                } else {
                    if(result.affectedRows === 0){
                        res.status(404).json({error: "The data is not deactive"});
                    }
                    else{
                        var table = (config.view === null) ? config.table : config.view;
                        self.emitEvent(config.event + '_DELETED', table, req.params.id, req, res);
                    }
                }
            });
            console.log(qry.sql);

        });

    }

    self._routes[config.table] = self._group;

}

Rest_doc_api.prototype.sql_promise = function(sql) {

  var self = this;

  return new Promise((resolve, reject) => {
      console.log(sql);
      self.con_.query(sql, (err, result) => {
        if(err){reject(err);}
        else{resolve(result);}
      });
  });

}

Rest_doc_api.prototype.emitEvent = function(event, table, id, req, res) {

    var self = this;

    var query = "SELECT * FROM " + table + " WHERE id = ?";
    var params = [ id ];
    var qry = self.con_.query(query, params, function(err, rows, fields){
        //console.log(rows);
        var data = (err || rows.length === 0) ? null: rows;
        console.log(data);
        res.status(200).jsonp({data: data});
        self.sockets_.emit(event, data);

    });
    console.log(qry.sql);

}

module.exports = Rest_doc_api;
