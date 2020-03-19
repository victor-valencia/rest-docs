'use strict'

module.exports = {

  BASE_CONFIG : '/api',

  TABLE_CONFIG: {
    created_date: 'created',
    modified_date: 'modified',
    active: 'deleted'
  },

  ROUTE_CONFIG: {
    table: 'table',
    view: null,
    event: 'TABLE',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'SEARCH', 'PUT_BATCH'],
    columns: []
  },

  COLUMN_CONFIG: {
    name: 'column', 
    primary: false
  }

}
