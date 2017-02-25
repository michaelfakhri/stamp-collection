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
  //$('table').bootstrapTable('hideColumn', 'country');
  //$('table').bootstrapTable('hideColumn', 'year');
  //$('table').bootstrapTable('hideColumn', 'view');
}

function parseAndAppendData (data, table) {
  data.forEach((user) => {
    if (user.id === 'local') {
      user.result.forEach((dataItem) => {
        dataItem.download = '<a href="javascript:node.view(\''+dataItem.hash + '\').then((data) => download_view(data,\'' + dataItem.name +'\'))">Found Locally</a>'
        dataItem.view = '<a href="javascript:node.view(\''+dataItem.hash + '\').then((data) => display_view(data))">View</a>'
        $(table).bootstrapTable('append', dataItem);
      })
    }
  })
}

function injectData () {
    for (var i = 0; i < 10; i++ ) {
      let request = new XMLHttpRequest()
      let url = 'https://unsplash.it/' + Math.floor((Math.random() * 1000) + 1) // resolution between 1 and 1000
      request.open("GET", url, true);
      request.responseType = "arraybuffer";

      request.onload = function (oEvent) {
        var arrayBuffer = request.response;
        if (arrayBuffer) {
          var byteArray = new Uint8Array(arrayBuffer);
          node.publish(byteArray, {name:("Image "+Math.floor((Math.random() * 200) + 1)), country: ("Country "+Math.floor((Math.random() * 200) + 1)), year:Math.floor((Math.random() * 2000) + 1)})
        }
      };
      request.send(null)
    }
    //$('#injectButton')[0].style.display = 'none'
}

function display_view (data) {
  var arrayBufferView = new Uint8Array( data );
  var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
  var urlCreator = window.URL || window.webkitURL;
  var imageUrl = urlCreator.createObjectURL( blob );
  var img = $( "#photo" );
  img[0].style.display = 'block'
  img[0].src = imageUrl;
}

function download_view (data, fileName) {
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  var arrayBufferView = new Uint8Array( data );
  var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
  var urlCreator = window.URL || window.webkitURL;
  var url = urlCreator.createObjectURL( blob );
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
}