function initializeForm () {}
function hideForm () {}

function initializeTable (table) {
  $(table).bootstrapTable({
    columns: [{
      field: 'name',
      title: 'Stamp'
    },{
      field: 'download',
      title: 'Download'
    }, {
      field: 'country',
      title: 'Country Of Origin <br><button onclick="jQuery(\'table\').bootstrapTable(\'hideColumn\', \'country\');">Remove</button>'
    }, {
      field: 'year',
      title: 'Year Of Origin <br><button onclick="jQuery(\'table\').bootstrapTable(\'hideColumn\', \'year\');">Remove</button>'
    }, {
      field: 'view',
      title: 'View <br><button onclick="jQuery(\'table\').bootstrapTable(\'hideColumn\', \'view\');">Remove</button>'
    }],
    data: []
  });
  $('table').bootstrapTable('hideColumn', 'country');
  $('table').bootstrapTable('hideColumn', 'year');
  $('table').bootstrapTable('hideColumn', 'view');
}

function parseAndAppendData (data, table) {
  // $(table).bootstrapTable('append', {id: 3,name: 'Item 3',price: '$3'});
}