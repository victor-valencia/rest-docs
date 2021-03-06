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
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Extras -> ['SEARCH', 'SEARCH_COLUMN', 'POST_BATCH', 'DELETE_BATCH']
    columns: []
  },

  COLUMN_CONFIG: {
    name: 'column', 
    primary: false
  }

}
