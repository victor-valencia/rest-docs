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

  // ROUTE_CONFIG: {
  //   table: 'table',
  //   view: null,
  //   event: 'TABLE',
  //   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Extras -> ['PATCH', 'SEARCH', 'SEARCH_COLUMN', 'POST_BATCH', 'PUT_BATCH', 'PATCH_BATCH', 'DELETE_BATCH']
  //   columns: []
  // },

  ROUTE_CONFIG: {
    tb: [], // Type: [TB_CONFIG, ...]
    fn: [], // Type: [FN_CONFIG, ...]
    sp: [], // Type: [SP_CONFIG, ...]
    //custom: []
  },

  TB_CONFIG: {
    table: 'table',
    view: null,
    event: 'TABLE',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Extras -> ['PATCH', 'SEARCH', 'SEARCH_COLUMN', 'POST_BATCH', 'PUT_BATCH', 'PATCH_BATCH', 'DELETE_BATCH']
    columns: [] // Type: [COLUMN_CONFIG, ...]
  },

  FN_CONFIG: {
    function: 'function',
    event: 'FUNCTION',
    params: [] // Type: [PARAM_CONFIG, ...]
  },

  SP_CONFIG: {
    procedure: 'procedure',
    event: 'PROCEDURE',
    params: [] // Type: [PARAM_CONFIG, ...]
  },

  COLUMN_CONFIG: {
    name: 'column', 
    primary: false,
    hidden: false
  },

  PARAM_CONFIG: {
    name: 'param'
  }

}
