'use strict'

module.exports = {

  BASE_CONFIG: '/api',

  PAGES: {
    docs: true,
    monitor: true
  },

  TABLE_CONFIG: {
    created_date: 'created',
    modified_date: 'modified',
    active: 'deleted'
  },

  ROUTE_CONFIG: {
    table: 'table',
    view: null,
    event: 'TABLE',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Extras -> ['SEARCH', 'SEARCH_COLUMN', 'POST_BATCH', 'PUT_BATCH', 'PATCH_BATCH', 'DELETE_BATCH']
    columns: []
  },

  COLUMN_CONFIG: {
    name: 'column', 
    primary: false
  }

}
